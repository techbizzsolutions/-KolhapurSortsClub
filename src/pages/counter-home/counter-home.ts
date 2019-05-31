import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Validators, FormBuilder } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

@IonicPage()
@Component({
  selector: 'page-counter-home',
  templateUrl: 'counter-home.html',
})
export class CounterHomePage {
  Counter: any;
  information: any;
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,public formBuilder: FormBuilder,
    private qrScanner: QRScanner,  public toastCtrl: ToastController,public navParams: NavParams) {
    this.information = this
      .formBuilder
      .group({
        "BIB": ['', Validators.required]
      });
  }
  
  logout()
  {
       localStorage.clear();
       this.navCtrl.setRoot(LoginPage);
  }
  
  getdata()
  {
    let user = JSON.parse(localStorage.getItem('user')) ;
    console.log(user.res);
    this.loader.Show("Loading...");
    this.api.auth('search_bib', {
      "competition_id":user.res.competition_id,
      "search":this.information.value.BIB,
    }).subscribe(res => {
      this.loader.Hide();
      console.log('this.search_bib',res);
      res.bib = this.information.value.BIB;
      if(res.authorization)
      {
        this.navCtrl.push('UserDetailsPage',res);
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
  create()
  {
    let user = JSON.parse(localStorage.getItem('user')) ;
    console.log(user.res);
    this.loader.Show("Loading...");
    this.api.auth('counter_entry_bib_no', {
      "competition_id":user.res.competition_id,
      "counter":user.res.counter,
      "bib_no":this.information.value.BIB,
      "entry_date":"",
      "entry_time":""
    }).subscribe(res => {
      this.loader.Hide();
      console.log('this.counter_entry_bib_no',res);
      if(res.authorization)
      {
        let toast = this.toastCtrl.create({
          message: res.message, 
          position: 'top',
          duration: 3000
        });
        toast.present();
        this.navCtrl.setRoot('CounterHomePage');
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
    console.log('ionViewDidLoad CounterHomePage');
  }

  scan()
  {
    console.log('scan');
        // Optionally request the permission early
    this.qrScanner.prepare().then((status: QRScannerStatus) => {
      console.log('scan status',status);
      if (status.authorized) {
        // camera permission was granted
        // start scanning
        const ionApp = <HTMLElement>document.getElementsByTagName("ion-app")[0];
        let scanSub = this.qrScanner.scan().subscribe((text: string) => {
          console.log('Scanned something', text);
          this.loader.Show("Loading...");
          ionApp.style.display = "block";
          this.information.get('BIB').setValue(text);
          this.qrScanner.hide(); // hide camera preview
          scanSub.unsubscribe(); // stop scanning
          // hack to hide the app and show the preview
          this.loader.Hide();
        });
       // show camera preview
       ionApp.style.display = "none";
       this.qrScanner.show();

       // wait for user to scan something, then the observable callback will be called
      } else if (status.denied) {
        let toast = this.toastCtrl.create({
          message: 'Camera permission is required for scan QR Code', 
          position: 'top',
          duration: 3000
        });
        toast.present();
        this.qrScanner.openSettings();                  
        // camera permission was permanently denied
        // you must use QRScanner.openSettings() method to guide the user to the settings page
        // then they can grant the permission from there
      } else {
        // permission was denied, but not permanently. You can ask for permission again at a later time.
      }
      })
      .catch((e: any) => 
      {
        console.log('scan status',e);
      });
  }
}
