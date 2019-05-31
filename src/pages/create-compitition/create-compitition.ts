import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import {Validators, FormBuilder } from '@angular/forms';
import { SmsServiceProvider } from '../../providers/sms-service/sms-service';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({
  selector: 'page-create-compitition',
  templateUrl: 'create-compitition.html',
})
export class CreateCompititionPage {
  Compitition:any;
  comdate:any = "Competition Date";
  comtime:any = "Competition Time"
  sportsType = [];
  constructor(public navCtrl: NavController,public formBuilder: FormBuilder,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public toastCtrl: ToastController,public smsServiceProvider: SmsServiceProvider, public navParams: NavParams) {
     this.Compitition = this.formBuilder.group({
      CompetitionName: ['', Validators.required],
      Counters:['', Validators.required]
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateCompititionPage');
    this.getSportsType();
  }

  getCompetition()
  {
    this.loader.Show("Loading...");
    this.api.auth('get_all_sports_type', {
    }).subscribe(res => {
      this.loader.Hide();
      if(res.authorization)
      {
        
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
      let toast = this.toastCtrl.create({
        message: 'Something went wrong, please try again', 
        position: 'top',
        duration: 3000
      });
      toast.present();
    })
  }

  getSportsType()
  {
    this.loader.Show("Loading...");
    this.api.auth('get_all_sports_type', {
    }).subscribe(res => {
      this.loader.Hide();
      if(res.authorization)
      {
         res.all_sports_type.forEach(element => {
          element.selected = false;
          element.total = 0;
         });
         this.sportsType = res.all_sports_type;
         console.log('this.sportsType',this.sportsType);
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

  getDate()
  {
      this.smsServiceProvider.getDate().then(res=>{
        this.comdate = res;
      })
  }

  getTime()
  {
    this.smsServiceProvider.getTime().then(res=>{
      this.comtime = res;
    })
  }

  create()
  {
    if(this.comdate === "Competition Date")
    {
      let toast = this.toastCtrl.create({
        message: 'Please select Competition Date',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
    if(this.comtime === "Competition Time")
    {
      let toast = this.toastCtrl.create({
        message: 'Please select Competition Time',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
    var check = false;
    let apicall= true;
    var arry = [];
    this.sportsType.forEach(element => {
        if(element.selected)
        {
          if(element.total !=0)
          {
            check = true;
            arry.push({
              "positions":element.total,
              "sports_type_id":element.sports_type_id
            });
          }
          else{
            check = true;
            let toast = this.toastCtrl.create({
              message: 'Please select No. of position of selected Sports',
              position: 'top',
              duration: 3000
            });
            toast.present();
            apicall = false;
            return;
          }
         
        }
    });
    if(!check)
    {
      let toast = this.toastCtrl.create({
        message: 'Please select Sports Type',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }

    if(apicall)
    {
      this.loader.Show("Loading...");
      this.api.auth('create_competition', {
        "name":this.Compitition.value.CompetitionName,
        "start_date":this.comdate,
        "start_time":this.comtime,
        "counters":this.Compitition.value.Counters,
        "sports_types": arry 
      }).subscribe(res => {
        this.loader.Hide();
        console.log('this.res',res);
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
    
  }
}
