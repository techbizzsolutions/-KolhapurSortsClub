import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { NgZone } from '@angular/core';

@IonicPage()
@Component({
  selector: 'page-import-candidate-list',
  templateUrl: 'import-candidate-list.html',
})

export class ImportCandidateListPage {
  Competition_Name:any;
  Sport:any;
  Competitions = [];
  Sports = [];
  loadProgress: Number = 0;
  showBar: boolean = false;
  fileTransfer: FileTransferObject;
  url:any;
  filename:any;
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    private transfer: FileTransfer,
    public ngZone: NgZone,
     public toastCtrl: ToastController,private fileChooser: FileChooser,public navParams: NavParams) {
      this.fileTransfer = this.transfer.create();

  }

  select(item)
  {
    console.log('ionViewDidLoad CreateInformationPage',item);
    this.Competition_Name = item;
    this.getSportsType(item.competition_id);
  }

  uploadimage()
  {
    this.fileChooser.open()
    .then(uri => 
      {
         console.log(uri);
         this.url = uri;
         this.filename = this.url.substr(this.url.lastIndexOf('/') + 1);
         if(!this.ValidateExtension())
         {
          let toast = this.toastCtrl.create({
            message: 'Please upload files having extension: xlsx only.',
            position: 'top',
            duration: 3000
          });
          toast.present();
          this.url = null;
          this.filename = null;
         }
      }
)
    .catch(e => console.log(e));
  }

ValidateExtension() {
    var allowedFiles = [".xlsx"];
    var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(" + allowedFiles.join('|') + ")$");
    if (!regex.test(this.filename.toLowerCase())) {
        return false;
    }
    return true;
}

  submit()
  {
    if(!this.Competition_Name)
    {
      let toast = this.toastCtrl.create({
        message: 'Please select Competition Name',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
    if(!this.Sport)
      {
        let toast = this.toastCtrl.create({
          message: 'Please select Sports Type',
          position: 'top',
          duration: 3000
        });
        toast.present();
        return;
      }
      if(!this.url)
      {
        let toast = this.toastCtrl.create({
          message: 'Please select file',
          position: 'top',
          duration: 3000
        });
        toast.present();
        return;
      }
      this.uploadOnServer();
  }

  uploadOnServer() {
    this.loader.Show("uploading..");
    console.log("imageFileUri", this.url);
    let user = JSON.parse(localStorage.getItem('user'));

    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: this.url.substr(this.url.lastIndexOf('/') + 1),
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      headers: {},
      chunkedMode: false,
      params:{
        "user_id":user.res.user_id,
        "competition_id":this.Competition_Name.competition_id,
        "sports_type_id":this.Sport.sports_type_id,
      }
    }
    this.showBar = true;
    console.log("options", options);
    this.fileTransfer.upload(this.url, 'http://technotwitsolutions.com/sportsclub/api/import_list', options)
      .then((data) => {
        // success
        console.log("data", data);
        let res = JSON.parse(data.response);
        console.log("data", res);
        this.loader.Hide();
        this.loadProgress = 100;
        let toast = this.toastCtrl.create({
          message: res.message, 
          position: 'top',
          duration: 3000
        });
        toast.present();
        this.navCtrl.setRoot('AdminHomePage');
        setTimeout(() => {
          this.showBar = false;
        }, 500);

      }, (err) => {
        // error
        this.loader.Hide();
        this.showBar = false;
        let toast = this.toastCtrl.create({
          message: err.message, 
          position: 'top',
          duration: 3000
        });
        toast.present();
        console.log("data err", err);
      }).catch((err) => {
        console.log("catch data", err);
        this.loader.Hide();
        this.showBar = false;
        let toast = this.toastCtrl.create({
          message: err.message, 
          position: 'top',
          duration: 3000
        });
        toast.present();
      });

    this.fileTransfer.onProgress((e) => {
      console.log((e.lengthComputable) ? Math.floor(e.loaded / e.total * 100) : -1);
      this.ngZone.run(() => {
        this.loadProgress = (e.lengthComputable) ? Math.floor(e.loaded / e.total * 100) : -1;
      });
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImportCandidateListPage');
    this.getCompetition();
  }

  getCompetition()
  {
    this.loader.Show("Loading...");
    this.api.auth('get_competition_list', {
    }).subscribe(res => {
      this.loader.Hide();
      console.log('this.get_competition_list',res);
      if(res.authorization)
      {
         this.Competitions = res.lisitng;
      }
      else{
        let toast = this.toastCtrl.create({
          message: res.message, 
          position: 'top',
          duration: 3000
        });
        toast.present();
      }
      
    }, err => {
      this.loader.Hide();
      console.log('login err',err);
      let toast = this.toastCtrl.create({
        message: 'Something went wrong, please try again', 
        position: 'top',
        duration: 3000
      });
      toast.present();
    })
  }

  getSportsType(id)
  {
    this.loader.Show("Loading...");
    this.api.auth('get_sports_type', {
      "competition_id":id
    }).subscribe(res => {
      this.loader.Hide();
      console.log('this.sportsType',res);
      if(res.authorization)
      {
        this.Sports = res.sports_type;
      }
      else{
        let toast = this.toastCtrl.create({
          message: res.message, 
          position: 'top',
          duration: 3000
        });
        toast.present();
      }
      
    }, err => {
      this.loader.Hide();
      console.log('login err',err);
      let toast = this.toastCtrl.create({
        message: 'Something went wrong, please try again', 
        position: 'top',
        duration: 3000
      });
      toast.present();
    })
  }

}
