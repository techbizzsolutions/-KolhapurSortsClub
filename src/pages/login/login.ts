import { Component } from '@angular/core';
import { NavController, AlertController,ToastController, Events } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';
import { ApiProvider } from '../../providers/api/api';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private register : FormGroup;
  user:any;
  region:any;
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public events: Events,
     public toastCtrl: ToastController,public formBuilder: FormBuilder,public alertCtrl: AlertController) {
    this.user = JSON.parse(localStorage.getItem('user'));
    console.log(this.user);
    if(this.user)
    {
      this.register = this.formBuilder.group({
        Password: ["", Validators.required],
        Mobile : [this.user.Mobile,Validators.compose([Validators.required, Validators.pattern('^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$'), Validators.maxLength(15)])]
      });
    }
    else{
      this.register = this.formBuilder.group({
        Password: ['', Validators.required],
        Mobile : ['',Validators.compose([Validators.required, Validators.pattern('^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$'), Validators.maxLength(15)])]
      });
    }
   
  }

  logForm()
  {
    console.log(this.register.value);
    if(!this.region)
    {
      let toast = this.toastCtrl.create({
        message: 'Please select Role',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
    let role = '0';
    switch(this.region)
    {
      case 'Admin':
      role = '0';
      break;
      case 'Counter':
      role = '1';
      break;
      case 'Position':
      role = '2';
      break;
      default:
      
    }
    this.loader.Show("Loading...");
      this.api.add('login', {
        "user_type":role,
        "phone":this.register.value.Mobile,
        "password":this.register.value.Password
      }).subscribe(res => {
        console.log('login',res);
        this.loader.Hide();
        if(res.authorization)
        {
          this.register.value.res = res;
          this.register.value.role = this.region;
          localStorage.setItem('user', JSON.stringify(this.register.value));
          this.events.publish('user:loggedIn');
        switch(this.region)
        {
          case 'Admin':
          this.navCtrl.setRoot('AdminHomePage');
          break;
          case 'Counter':
          this.navCtrl.setRoot('CounterHomePage');
          break;
          case 'Position':
          this.navCtrl.setRoot('PositionHomePage');
          break;
          default:
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

  login()
  {
    this.navCtrl.push('ForgotMobilePage');
  }
  
}