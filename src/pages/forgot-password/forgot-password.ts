import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoginPage } from '../login/login';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  private register: FormGroup;
  user: any;
  constructor(public navCtrl: NavController, private loader: LoaderServiceProvider,
    public api: ApiProvider, public toastCtrl: ToastController, public formBuilder: FormBuilder, public alertCtrl: AlertController) {
    this.user = JSON.parse(localStorage.getItem('user'));
    console.log(this.user);
    if (this.user) {
      this.register = this.formBuilder.group({
        Password: ["", Validators.required],
        ConfirmPassword: ["", Validators.required]
      });
    }
    else {
      this.register = this.formBuilder.group({
        Password: ['', Validators.required],
        ConfirmPassword: ["", Validators.required],
      });
    }

  }

  logForm() {
    if (this.register.value.Password == this.register.value.Password) {
      this.loader.Show("Loading...");
      this.api.auth('change_password', {
        "new_password": this.register.value.Password
      }).subscribe(res => {
        console.log('logForm', res);
        this.loader.Hide();
        if (res.authorization) {
          console.log("catch", this.user.role);
          let toast = this.toastCtrl.create({
            message: res.message,
            position: 'top',
            duration: 3000
          });
          toast.present();
          this.navCtrl.push(LoginPage);        }
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
        console.log('getProfession err', err);
        let toast = this.toastCtrl.create({
          message: 'Something went wrong, please try again',
          position: 'top',
          duration: 3000
        });
        toast.present();
      });
    }
    else {
      let toast = this.toastCtrl.create({
        message: 'Password does not match',
        position: 'top',
        duration: 3000
      });
      toast.present();
    }

  }
}