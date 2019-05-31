import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController, ToastController} from 'ionic-angular';
import {LoaderServiceProvider} from '../../providers/loader-service/loader-service';
import {ApiProvider} from '../../providers/api/api';

@IonicPage()
@Component({selector: 'page-user-details', templateUrl: 'user-details.html'})
export class UserDetailsPage {
  counterType : any;
  data : any;
  constructor(public navCtrl : NavController, private loader : LoaderServiceProvider, public toastCtrl : ToastController, public api : ApiProvider, public alertCtrl : AlertController, public navParams : NavParams) {
    this.counterType = JSON.parse(localStorage.getItem('user'));
    this.counterType = this.counterType.res;
    console.log(this.counterType);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserDetailsPage', this.navParams.data);
    this.data = this.navParams.data;
    let user = JSON.parse(localStorage.getItem('user')) ;
    console.log("check"+user.res);
  }

  submit() {
    let user = JSON.parse(localStorage.getItem('user'));
    console.log(user.res);
    this
      .loader
      .Show("Loading...");
    this
      .api
      .auth('counter_entry_bib_no', {
        "competition_id": user.res.competition_id,
        "counter": user.res.counter,
        "bib_no": this.navParams.data.bib,
        "entry_date": "",
        "entry_time": ""
      })
      .subscribe(res => {
        this
          .loader
          .Hide();
        console.log('this.counter_entry_bib_no', res);
        if (res.authorization) {
          let toast = this
            .toastCtrl
            .create({message: res.message, position: 'top', duration: 3000});
          toast.present();
          this
            .navCtrl
            .setRoot('CounterHomePage');
        } else {
          let toast = this
            .toastCtrl
            .create({message: res.message, position: 'top', duration: 3000});
          toast.present();
        }

      }, err => {
        this
          .loader
          .Hide();
        console.log('login err', err);
        let toast = this
          .toastCtrl
          .create({message: 'Something went wrong, please try again', position: 'top', duration: 3000});
        toast.present();
      })
  }
  showAgree() {
    let message = "I, " + this.data.name + " BIB NO. " + this.data.bib_no + " is participating in the " + this.data.sports_type + " Event held on " + this.data.added_date;
    message = message + ` (the “Event”) agree and
    understand that the event is potentially hazardous and I choose to do this out of my own free
    will, choice and consent.
    I fully accept and assume for myself all risks, whether before, during or after the Event and its
    related activities. The risks of physical injury, mental injury, emotional distress, trauma, death,
    contact with other participants, equipment failure, inadequate safety equipment, act of God, the
    effects of weather including extreme temperature or conditions, are included in this. I will be
    solely responsible for the condition and adequacy of my equipment. All risks involved are known
    to me. I shall assume and pay any medical and emergency expenses for myself in the event of
    injury, illness, or other inability.
    I realize that participating in all aspects of the Event requires physical conditioning and I
    represent and undertake that I am in sound medical condition capable of participating in the
    activities without risk to myself or others. I have no medical impediment which would endanger
    me or others. I understand and agree that a situation may arise during any part of the Event
    which may be beyond the control of the Event Coordinators. I undertake to participate safely
    within the limits of my own abilities and in a manner so as not to endanger either myself or
    others.
    Knowing these facts, I for myself and anyone acting on my behalf shall not sue or hold liable or
    responsible, anyone involved in organizing / Co-ordinating the Event including Kolhapur Sports
    Club, its members and agents harmless from any and all claims, demands and actions of any and
    every kind. I hereby waive all right or any right accrued against the Kolhapur Sports Club, its
    organizers, co-ordinators and agents or related parties directly or indirectly arising out of my
    attending or participating in all aspects of this Event. My waiver and release of all claims,
    demands, actions and liability shall include without limitation, any injury, damage or loss to my
    person or property which may be (a) caused by any act, or failure to act, by the above-identified
    persons and entities or (b) sustained by me before, during or after being involved in the Event
    and its related activities.
    I further agree to indemnify and hold the above parties harmless from any and all losses,
    damages, claims and expenses, including attorneys&#39; fees, arising from or relating in any respect
    to my participation in the Event or its related activities or my breach of this Indemnity cum
    Undertaking. I agree to be bound by the terms of this Indemnity cum Undertaking.
    I have read, understood and unconditionally agree for the above.`;
    let confirmAlert = this
      .alertCtrl
      .create({
        subTitle: "Disclaimer",
        message: message,
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              return;
            }
          }, {
            text: 'I agree',
            handler: () => {
              this
                .navCtrl
                .push('SubmitUserPage', this.data);
            }
          }
        ]
      });
    confirmAlert.present();
  }
}
