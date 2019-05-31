import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events, ToastController } from 'ionic-angular';
import { SmsServiceProvider } from '../../providers/sms-service/sms-service';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html',
})
export class OtpPage {

  otp:any;
  user:any;
  constructor(public navCtrl: NavController,
    public events: Events,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    private openNativeSettings: OpenNativeSettings,public smsServiceProvider: SmsServiceProvider,public alertCtrl: AlertController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.user = JSON.parse(localStorage.getItem('user')) ;
    console.log('ionViewDidLoad OtpPage',this.user);
  }

  resendOtp()
  {
    let role = '0';
    switch(this.user.role)
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
        "phone":this.user.Mobile,
        "password":this.user.Password
      }).subscribe(res => {
        console.log('login',res);
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
            case 2:
            {
              this.openNativeSettings.open("application").then(res=>{
              })
              .catch(err=>{})
            }
            break;
            case 4:
            {
             
            }
            break;
            default :
            this.navCtrl.setRoot('');
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

  verifyOtp()
  {
    if(this.otp)
    {
      this.loader.Show("Loading...");
      this.api.auth('check_otp', {
      "otp":this.otp
    }).subscribe(res => {
       console.log('logForm',res);
       this.loader.Hide();
       if(res.authorization)
       {
        console.log("catch",this.user.role);
        this.navCtrl.push('ForgotPasswordPage');
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
      console.log('getProfession err',err);
      let toast = this.toastCtrl.create({
        message: 'Something went wrong, please try again', 
        position: 'top',
        duration: 3000
      });
      toast.present();
    });
      
    }
    else{
      this.showAlert("Please enter otp", 4); 
    }
  }

  editnumber()
  {
    this.navCtrl.setRoot('ForgotMobilePage');
  }
}
