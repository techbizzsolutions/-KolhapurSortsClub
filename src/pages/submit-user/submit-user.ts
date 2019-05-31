import { Component,ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';
import { ApiProvider } from '../../providers/api/api';
import {SignaturePad} from 'angular2-signaturepad/signature-pad';

@IonicPage()
@Component({
  selector: 'page-submit-user',
  templateUrl: 'submit-user.html',
})
export class SubmitUserPage {
  @ViewChild(SignaturePad) public signaturePad : SignaturePad;
  public signaturePadOptions : Object = {
    'minWidth': 2,
    'canvasWidth': 340,
    'canvasHeight': 300
  };
  constructor(public navCtrl: NavController, private loader: LoaderServiceProvider,public toastCtrl: ToastController,
    public api: ApiProvider, public navParams: NavParams) {
  }

  drawComplete() {
    console.log(this.signaturePad.toDataURL());
    this.create();
  }

  drawClear() {
    this.signaturePad.clear();
  }

  canvasResize() {
    let canvas = document.querySelector('canvas');
    this.signaturePad.set('minWidth', 1);
    this.signaturePad.set('canvasWidth', canvas.offsetWidth);
    this.signaturePad.set('canvasHeight', canvas.offsetHeight);
  }

ngAfterViewInit() {
      this.signaturePad.clear();
      this.canvasResize();
}
  ionViewDidLoad() {
    console.log('ionViewDidLoad SubmitUserPage',this.navParams.data);
  }

  create()
  {
    let user = JSON.parse(localStorage.getItem('user')) ;
    console.log(user.res);
    this.loader.Show("Loading...");
    this.api.auth('counter_entry_bib_no', {
      "competition_id":user.res.competition_id,
      "counter":user.res.counter,
      "bib_no":this.navParams.data.bib,
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

}
