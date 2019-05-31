import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { SmsServiceProvider } from '../../providers/sms-service/sms-service';
import {Validators, FormBuilder } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({
  selector: 'page-start-competition-swimming',
  templateUrl: 'start-competition-swimming.html',
})
export class StartCompetitionSwimmingPage {

  Competition_Name:any;
  Competitions = [];
  Sports=[];
    Sport:any;
    time:any; 
    information:any;
  constructor(public navCtrl: NavController,   private loader: LoaderServiceProvider,
    public api: ApiProvider, public formBuilder: FormBuilder, public toastCtrl: ToastController,public smsServiceProvider: SmsServiceProvider,public navParams: NavParams) {
    this.information = this.formBuilder.group({
      From:['', Validators.required],
      To:['', Validators.required]
      });
  }

  timeselect()
  {
    this.smsServiceProvider.getTime().then(res=>{
      this.time = res;
    })
  }
  select(item)
  {
    console.log('ionViewDidLoad CreateInformationPage',item);
    this.Competition_Name = item;
    this.getSportsType(item.competition_id);
  }

  save()
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
        message: 'Please select Sports type',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
     }
     if(!this.time)
     {
      let toast = this.toastCtrl.create({
        message: 'Please select Time',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
     }
     var date = new Date();
     let mnth = date.getMonth() + 1;
     this.loader.Show("Loading...");
     this.api.auth('start_competition', {
       "competition_id":this.Competition_Name.competition_id,
       "sports_type_id":this.Sport.sports_type_id,
       "start_date":date.getFullYear()+"-"+ mnth +"-"+date.getDate(),
       "start_time":this.time,
       "bib_from":this.information.value.From,
       "bib_to":this.information.value.To,   
     }).subscribe(res => {
       this.loader.Hide();
       console.log('this.start_competition',res);
       if(res.authorization)
       {
         let toast = this.toastCtrl.create({
           message: res.message, 
           position: 'top',
           duration: 3000
         });
         toast.present();
         this.navCtrl.setRoot('AdminHomePage');
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
    console.log('ionViewDidLoad StartCompetitionPage');
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