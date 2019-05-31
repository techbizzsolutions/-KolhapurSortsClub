import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform } from 'ionic-angular';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';
import { ApiProvider } from '../../providers/api/api';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

@IonicPage()
@Component({
  selector: 'page-admin-home',
  templateUrl: 'admin-home.html',
})
export class AdminHomePage {
  role: any = "Counter wise report details";
  Competition_Name: any;
  Competitions = [];
  Sports = [];
  Sport: any;
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    private fileOpener: FileOpener,
    private transfer: FileTransfer,
    private file: File,
    private androidPermissions: AndroidPermissions,
    public platform: Platform,
    public toastCtrl: ToastController, public navParams: NavParams) {
  }

  select(item) {
    console.log('ionViewDidLoad select', item);
    this.Competition_Name = item;
    this.getSportsType(item.competition_id);
  }

  selectedValue(item) {
    console.log('ionViewDidLoad selectedValue', item);
    this.role = item;

  }

  Export() {
    if (!this.Competition_Name) {
      let toast = this.toastCtrl.create({
        message: 'Please select Competition Name',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
    if (this.role == "Counter wise report details") {
      this.loader.Show("Loading...");
      this.api.auth('get_report', {
        "competition_id": this.Competition_Name.competition_id,
        "report_type": "1"
      }).subscribe(res => {
        this.loader.Hide();
        console.log('this.get_report', res);
        if (res.authorization) {
          console.log('this.get_report', res.report);
          this.retrieveFile(res.report);
        }
        else {
          let toast = this.toastCtrl.create({
            message: res.message,
            position: 'top',
            duration: 3000
          });
          toast.present();
        }

      }, err => {
        this.loader.Hide();
        console.log('login err', err);
        let toast = this.toastCtrl.create({
          message: 'Something went wrong, please try again',
          position: 'top',
          duration: 3000
        });
        toast.present();
      })
    }
    else {
      if (!this.Sport) {
        let toast = this.toastCtrl.create({
          message: 'Please select Sports type',
          position: 'top',
          duration: 3000
        });
        toast.present();
        return;
      }
      this.loader.Show("Loading...");
      this.api.auth('get_report', {
        "competition_id": this.Competition_Name.competition_id,
        "sports_type_id": this.Sport.sports_type_id,
        "report_type": "2"
      }).subscribe(res => {
        this.loader.Hide();
        console.log('this.get_report', res);
        if (res.authorization) {
          console.log('this.get_report', res.report);
          this.retrieveFile(res.report);
        }
        else {
          let toast = this.toastCtrl.create({
            message: res.message,
            position: 'top',
            duration: 3000
          });
          toast.present();
        }

      }, err => {
        this.loader.Hide();
        console.log('login err', err);
        let toast = this.toastCtrl.create({
          message: 'Something went wrong, please try again',
          position: 'top',
          duration: 3000
        });
        toast.present();
      })
    }
  }

  retrieveFile(code) {
    if (this.platform.is('cordova')) {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
        result => {
          console.log('Has permission?', result.hasPermission);
          if (result.hasPermission) {
            this.download(code);
          }
          else {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
          }
        },
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
      );
    }
  }

  download(imageLocation) {
    this.loader.Show("Downloading...");
    console.log('item', decodeURI(imageLocation));
    console.log('item', encodeURI(imageLocation));
    this.platform.ready().then(() => {
      const fileTransfer: FileTransferObject = this.transfer.create();
        fileTransfer.download(encodeURI(imageLocation), (this.file.externalRootDirectory || this.file.dataDirectory) + 'KolhapurSportsClub/'+imageLocation.substr(imageLocation.lastIndexOf('/') + 1)).then((entry) => {
        console.log('download complete: ' + entry.toURL());
        let toast = this.toastCtrl.create({
          message: 'Image downloaded successfully, file location is inside filemanager/KolhapurSportsClub',
          position: 'top',
          duration: 3000
        });
        toast.present();
        this.fileOpener.open(decodeURI(entry.toURL()),'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
          .then(() => console.log('File is opened'))
          .catch(e => console.log('Error openening file', e));
        this.loader.Hide();
      }, (error) => {
        // handle error
        console.log('download error: ', error);
        let toast = this.toastCtrl.create({
          message: 'Something went wrong, please try again',
          position: 'top',
          duration: 3000
        });
        toast.present();
        this.loader.Hide();
      });

    });
  }


  reload() {
    this.ionViewDidLoad();
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminHomePage');
    this.getCompetition();
  }

  getSportsType(id) {
    this.loader.Show("Loading...");
    this.api.auth('get_sports_type', {
      "competition_id": id
    }).subscribe(res => {
      this.loader.Hide();
      console.log('this.sportsType', res);
      if (res.authorization) {
        this.Sports = res.sports_type;
      }
      else {
        let toast = this.toastCtrl.create({
          message: res.message,
          position: 'top',
          duration: 3000
        });
        toast.present();
      }

    }, err => {
      this.loader.Hide();
      console.log('login err', err);
      let toast = this.toastCtrl.create({
        message: 'Something went wrong, please try again',
        position: 'top',
        duration: 3000
      });
      toast.present();
    })
  }

  getCompetition() {
    this.loader.Show("Loading...");
    this.api.auth('get_competition_list', {
    }).subscribe(res => {
      this.loader.Hide();
      console.log('this.get_competition_list', res);
      if (res.authorization) {
        this.Competitions = res.lisitng;
      }
      else {
        let toast = this.toastCtrl.create({
          message: res.message,
          position: 'top',
          duration: 3000
        });
        toast.present();
      }

    }, err => {
      this.loader.Hide();
      console.log('login err', err);
      let toast = this.toastCtrl.create({
        message: 'Something went wrong, please try again',
        position: 'top',
        duration: 3000
      });
      toast.present();
    })
  }
}
