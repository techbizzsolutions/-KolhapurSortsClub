import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUsPage {
  lists= [
     'Chetan Chavan (President)',
     'Vijay Kulkarni (Vice President)',
     'Uday Patil (Secretary)',
     'Ashish Tambake (Treasurer)',
     'Vaibhav Belgaonkar (Director)',
     'Sanjay Patil (Director)',
     'Sandesh Bagadi (Director)',
     'Gorakh Mali (Director)',
     'Pradeep Patil (Director)',
     'Mahesh Shelkhe (Director)'
    ]
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactUsPage');
  }

}
