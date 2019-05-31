import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AndroidPermissions } from '@ionic-native/android-permissions';

@IonicPage()
@Component({
  selector: 'page-candidate-list',
  templateUrl: 'candidate-list.html',
})
export class CandidateListPage {
  Competition_Name: any;
  Competitions = [];
  Sports = [];
  Sport: any;
  listdata = [];
  page: any = '1';
  constructor(public navCtrl: NavController, private loader: LoaderServiceProvider,
    private transfer: FileTransfer,
    private file: File,
    private androidPermissions: AndroidPermissions,
    public platform: Platform,
    public api: ApiProvider, public toastCtrl: ToastController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartCompetitionPage');
    this.getCompetition();
  }

  downloadall() {
    for (let index = 0; index < this.listdata.length; index++) {
      if (this.listdata[index].qr_code) {
        this.retrieveFile(this.listdata[index], '1');
      }
    }
  }

  retrieveFile(code, id) {
    if (this.platform.is('cordova')) {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
        result => {
          console.log('Has permission?', result.hasPermission);
          if (result.hasPermission) {
            this.file.checkFile((this.file.externalRootDirectory || this.file.dataDirectory) + '/KolhapurSportsClub/', code.qr_code.substr(code.qr_code.lastIndexOf('/') + 1))
              .then(() => {
                let toast = this.toastCtrl.create({
                  message: 'Image already downloaded successfully',
                  position: 'top',
                  duration: 3000
                });
                toast.present();
              })
              .catch((err) => {
                console.log('checkFile error: ', err);
                if (id == '1') {
                  this.downloadAll(code.qr_code);
                }
                else {
                  this.loader.Show('Downloading..');
                  this.download(code.qr_code);
                }
              });
          }
          else {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
          }
        },
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
      );
    }
  }

  downloadAll(imageLocation) {
    console.log('item', imageLocation);
    this.platform.ready().then(() => {
      const fileTransfer: FileTransferObject = this.transfer.create();
      fileTransfer.download(imageLocation, (this.file.externalRootDirectory || this.file.dataDirectory) + '/KolhapurSportsClub/' + imageLocation.substr(imageLocation.lastIndexOf('/') + 1)).then((entry) => {
        console.log('download complete: ' + entry.toURL());
        let toast = this.toastCtrl.create({
          message: 'Image downloaded successfully, file location is inside filemanager/KolhapurSportsClub',
          position: 'top',
          duration: 3000
        });
        toast.present();
      }, (error) => {
        // handle error
        console.log('download error: ', error);
        let toast = this.toastCtrl.create({
          message: 'Something went wrong, please try again',
          position: 'top',
          duration: 3000
        });
        toast.present();
      });

    });
  }

  download(imageLocation) {
    console.log('item', imageLocation);
    this.platform.ready().then(() => {
      const fileTransfer: FileTransferObject = this.transfer.create();
      fileTransfer.download(imageLocation, (this.file.externalRootDirectory || this.file.dataDirectory) + '/KolhapurSportsClub/' + imageLocation.substr(imageLocation.lastIndexOf('/') + 1)).then((entry) => {
        console.log('download complete: ' + entry.toURL());
        let toast = this.toastCtrl.create({
          message: 'Image downloaded successfully, file location is inside filemanager/KolhapurSportsClub',
          position: 'top',
          duration: 3000
        });
        toast.present();
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

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    setTimeout(() => {
      this.getList(this.page);
      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
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


  select(item) {
    console.log('ionViewDidLoad CreateInformationPage', item);
    this.Competition_Name = item;
    this.getSportsType(item.competition_id);
  }

  getList(page) {
    this.page = page;
    if (!this.Competition_Name) {
      let toast = this.toastCtrl.create({
        message: 'Please select Competition Name',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
    if (!this.Sport) {
      let toast = this.toastCtrl.create({
        message: 'Please select Sports type',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }

    this.api.auth('get_participants_data', {
      "competition_id": this.Competition_Name.competition_id,
      "sports_type_id": this.Sport.sports_type_id,
      "page": this.page
    }).subscribe(res => {

      console.log('this.sportsType', res);
      if (res.authorization) {
        console.log(' this.listdata', this.listdata);
        if (this.page == '1') {
          this.listdata = res.listing;
        }
        else {
          this.listdata = this.listdata.concat(res.listing);
        }
        this.page++;
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
