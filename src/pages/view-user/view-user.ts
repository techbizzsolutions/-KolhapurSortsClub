import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({
  selector: 'page-view-user',
  templateUrl: 'view-user.html',
})
export class ViewUserPage {

  Competition_Name: any;
  Competitions = [];
    userList = [];
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider, public toastCtrl: ToastController,public navParams: NavParams) {
  }

  adduser()
  {
    this.navCtrl.push('CreateInformationPage');
  }
  select(item) {
    console.log('ionViewDidLoad CreateInformationPage', item);
    this.Competition_Name = item;
  }

  save()
  {
    if (!this.Competition_Name) {
      let toast = this.toastCtrl.create({
        message: 'Please select Competition Name',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
    this.loader.Show("Loading...");
    this.api.auth('get_volunteers_list', {
      "competition_id":this.Competition_Name.competition_id,
    }).subscribe(res => {
      this.loader.Hide();
      console.log('this.get_volunteers_list',res);
      if(res.authorization)
      {
         this.userList = res.volunteers_list;         
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
    console.log('ionViewDidLoad ViewUserPage');
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

}
