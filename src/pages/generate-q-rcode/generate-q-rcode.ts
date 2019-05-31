import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { SmsServiceProvider } from '../../providers/sms-service/sms-service';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({
  selector: 'page-generate-q-rcode',
  templateUrl: 'generate-q-rcode.html',
})
export class GenerateQRcodePage {
  all: boolean = false;
  Competition_Name: any;
  Competitions = [];
  userList = [
    {
      'name': "Ajay",
      'id': '1',
      'selected': false
    },
    {
      'name': "Raj",
      'id': '2',
      'selected': false
    },
    {
      'name': "Sonu",
      'id': '2',
      'selected': false
    }];
  Sports = [];
  Sport: any;
  time: any;
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider, public toastCtrl: ToastController, public smsServiceProvider: SmsServiceProvider, public navParams: NavParams) {
  }

  selectuser() {
    this.all = false;
  }
  allselect() {
    console.log('allselect', this.all);
    if (this.all) {
      for (let i = 0; i < this.userList.length; i++) {
        this.userList[i].selected = true;
      }
    }
    else {
      for (let i = 0; i < this.userList.length; i++) {
        this.userList[i].selected = false;
      }
    }

  }

  timeselect() {
    this.smsServiceProvider.getTime().then(res => {
      this.time = res;
    })
  }
  select(item) {
    console.log('ionViewDidLoad CreateInformationPage', item);
    this.Competition_Name = item;
    this.getSportsType(item.competition_id);
  }

  save() {
    if (!this.Competition_Name) {
      let toast = this.toastCtrl.create({
        message: 'Please select Competition Name',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
    if (!this.Sport) {
      let toast = this.toastCtrl.create({
        message: 'Please select Sports type',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
  }

  generate() {
    // console.log('generate', this.userList);
    // var check = false;
    // var arry = [];
    // this.userList.forEach(element => {
    //   if (element.selected) {
    //     check = true;
    //     return;
    //   }
    // });
    // if (!check) {
    //   let toast = this.toastCtrl.create({
    //     message: 'Please select Sports Type',
    //     position: 'top',
    //     duration: 3000
    //   });
    //   toast.present();
    //   return;
    // }
    if (!this.Competition_Name) {
      let toast = this.toastCtrl.create({
        message: 'Please select Competition Name',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
    if (!this.Sport) {
      let toast = this.toastCtrl.create({
        message: 'Please select Sports type',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }

    this.loader.Show("Loading...");
    this.api.auth('generate_qr', {
      "competition_id":this.Competition_Name.competition_id,
      "sports_type_id":this.Sport.sports_type_id
    }).subscribe(res => {
      this.loader.Hide();
      console.log('this.generate_qr',res);
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
    console.log('ionViewDidLoad StartCompetitionPage');
    this.getCompetition();
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

  seedata()
  {
    this.navCtrl.push('CandidateListPage');
  }
}
