import { Component } from '@angular/core';
import {IonicPage, NavController, AlertController,ToastController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';
import { SmsServiceProvider } from '../../providers/sms-service/sms-service';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';


@IonicPage()
@Component({
  selector: 'page-forgot-mobile',
  templateUrl: 'forgot-mobile.html',
})
export class ForgotMobilePage {
  private register : FormGroup;
  user:any;
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    private openNativeSettings: OpenNativeSettings,
    public smsServiceProvider: SmsServiceProvider,
    public api: ApiProvider, public toastCtrl: ToastController,public formBuilder: FormBuilder,public alertCtrl: AlertController) {
    this.user = JSON.parse(localStorage.getItem('user'));
    console.log(this.user);
    if(this.user)
    {
      this.register = this.formBuilder.group({
        Mobile : [this.user.Mobile,Validators.compose([Validators.required, Validators.pattern('^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$'), Validators.maxLength(15)])]
      });
    }
    else{
      this.register = this.formBuilder.group({
        Mobile : ['',Validators.compose([Validators.required, Validators.pattern('^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$'), Validators.maxLength(15)])]
      });
    }
   
  }

  logForm()
  {
    this.loader.Show("Loading...");
    this.api.add('forgot_password', {
      "phone":this.register.value.Mobile,
    }).subscribe(res => {
      console.log('forgot_password',res);
      this.loader.Hide();
      if(res.authorization)
      {
        this.register.value.res = res;
        localStorage.setItem('user', JSON.stringify(this.register.value));
        this.smsServiceProvider.sendMessage(this.register.value.Mobile,"Your OTP is " + res.otp).then(res=>{
          if(res)
          {
           this.showAlert("Otp has been sent successfully to " +this.register.value.Mobile, 1); 
          }
          else{
           this.showAlert("Please enable sms permission,Goto applications->Choose Law Protectors app ->Permissions-> enable sms", 2);    
          }
                        
         }).catch(res=>{
           console.log("smsServiceProvider catch" +res);
           this.showAlert("Messgae has been failed, please check your message service", 3); 
         })
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

  showAlert(message,bol)
  {
    let alert = this.alertCtrl.create({
      subTitle: message,
      buttons: [{
        text: 'Ok',
        handler: () => {
          switch (bol)
          {
            case 1:
            this.navCtrl.setRoot('OtpPage');
            break;
            case 2:
            {
              this.openNativeSettings.open("application").then(res=>{
              })
              .catch(err=>{})
            }
            break;
            default :
            this.navCtrl.setRoot('OtpPage');
          }
        }
      },
      {
        text: 'Cancel',
        handler: () => {
          // close the sliding item
        }
      }]
    });
    // now present the alert on top of all other content
    alert.present();
  }
}