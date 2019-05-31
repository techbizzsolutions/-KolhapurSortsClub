import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import {Validators, FormBuilder } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({
  selector: 'page-create-information',
  templateUrl: 'create-information.html',
})
export class CreateInformationPage {
  Competition_Name:any;
  Competitions = [];
  Sports=[];
  role:any = "Counter Access";  
  Counters=[];
  Positions = [];
  Sport:any;
  Counter:any;
  Position:any;
  isSports:boolean= true;
  isCounters:boolean= false;
  isPositions:boolean = true;
  information:any;
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,public toastCtrl: ToastController,public formBuilder: FormBuilder, public navParams: NavParams) {
    this.information = this.formBuilder.group({
      Mobile : ['',Validators.compose([Validators.required, Validators.pattern('^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$'), Validators.maxLength(15)])],
      Password:['', Validators.required],
      Name:['', Validators.required],
      });
  }

  select(item)
  {
    console.log('ionViewDidLoad CreateInformationPage',item);
    this.Competition_Name = item;
    this.getSportsType(item.competition_id);
  }

  selectSport(item)
  {
    this.getPosition(item.sports_type_id);
  }
  selectedValue(item)
  {
    this.Sport = null;
    this.Counter = null;
    this.Position = null;
    if(item == "Counter Access")
    { 
        this.role = item;
        this.isCounters = false;
        this.isSports = true;
        this.isPositions =true;
        
    }
    else{
        this.role = item;
        this.isCounters = true;
        this.isSports = false;
        this.isPositions =false;
    }
  }

  create()
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
    if(this.role == "Counter Access")
    {
      if(!this.Counter)
      {
        let toast = this.toastCtrl.create({
          message: 'Please select Counter Number',
          position: 'top',
          duration: 3000
        });
        toast.present();
        return;
      }
    }
    else{
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
      else{
        if(!this.Position)
          {
            let toast = this.toastCtrl.create({
              message: 'Please select Position Number',
              position: 'top',
              duration: 3000
            });
            toast.present();
            return;
          }
      }
    }
    this.loader.Show("Loading...");
    this.api.auth('add_user', {
      "competition_id":this.Competition_Name.competition_id,
      "sports_type_id":(this.role == "Counter Access")?"":this.Sport.sports_type_id,
      "position":(this.role == "Counter Access")?"":this.Position.position,
      "counter":(this.role == "Counter Access")?this.Counter.counter:"",
      "phone":this.information.value.Mobile,
      "password":this.information.value.Password,
      "name":this.information.value.Name
    }).subscribe(res => {
      this.loader.Hide();
      console.log('this.add_user',res);
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
    console.log('ionViewDidLoad CreateInformationPage');
    this. getCompetition();
  }

  getPosition(id:any)
  {
    this.loader.Show("Loading...");
    this.api.auth('get_cp_of_competition', {
      "competition_id":this.Competition_Name.competition_id,
      "sports_type_id":this.Sport.sports_type_id,
    }).subscribe(res => {
      this.loader.Hide();
      console.log('this.get_cp_of_competition',res);
      if(res.authorization)
      {
        this.Positions = res.positions;
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

  getCounter(id:any)
  {
    this.loader.Show("Loading...");
    this.api.auth('get_cp_of_competition', {
      "competition_id":id
        }).subscribe(res => {
      this.loader.Hide();
      console.log('this.get_cp_of_competition',res);
      if(res.authorization)
      {
        this.Counters = res.counters;
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
        if(this.role == "Counter Access")
        {
           this.getCounter(id);
        }
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
