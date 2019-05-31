import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {SmsServiceProvider} from '../../providers/sms-service/sms-service';
import {Validators, FormBuilder} from '@angular/forms';
import {LoginPage} from '../login/login';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({selector: 'page-position-home', templateUrl: 'position-home.html'})
export class PositionHomePage {
  Sports = [
    {
      'name': "Cricket",
      'id': '1'
    }, {
      'name': "Hockey",
      'id': '2'
    }
  ];
  Sport : any;
  information : any;
  time : any;
  constructor(public navCtrl : NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider, public formBuilder : FormBuilder, public toastCtrl : ToastController, public smsServiceProvider : SmsServiceProvider, public navParams : NavParams) {
    this.information = this
      .formBuilder
      .group({
        // Position: [
        //   '', Validators.required
        // ],
        BIB: ['', Validators.required]
      });
  }

  timeselect() {
    this
      .smsServiceProvider
      .getTime()
      .then(res => {
        this.time = res;
      })
  }

  logout() {
    localStorage.clear();
    this
      .navCtrl
      .setRoot(LoginPage);
  }

  create() {
    // if (!this.Sport) {
    //   let toast = this
    //     .toastCtrl
    //     .create({message: 'Please select Competition Name', position: 'top', duration: 3000});
    //   toast.present();
    //   return;
    // }
    // if (!this.time) {
    //     let toast = this
    //       .toastCtrl
    //       .create({message: 'Please select Time', position: 'top', duration: 3000});
    //     toast.present();
    //     return;
    //   }
    let user = JSON.parse(localStorage.getItem('user')) ;
    console.log(user.res);
    this.loader.Show("Loading...");
    this.api.auth('position_entry_bib_no', {
      "competition_id":user.res.competition_id,
      "sports_type_id":user.res.sports_type_id,
      "position":user.res.position,
      "bib_no":this.information.value.BIB,
      "entry_date":"",
      "entry_time":""
    }).subscribe(res => {
      this.loader.Hide();
      console.log('this.position_entry_bib_no',res);
      if(res.authorization)
      {
        let toast = this.toastCtrl.create({
          message: res.message, 
          position: 'top',
          duration: 3000
        });
        toast.present();
        //this.navCtrl.setRoot('PositionHomePage');
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
  ionViewDidLoad() {
    console.log('ionViewDidLoad PositionHomePage');
  }

}
