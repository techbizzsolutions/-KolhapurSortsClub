import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({
  selector: 'page-sports-with-sheet',
  templateUrl: 'sports-with-sheet.html',
})
export class SportsWithSheetPage {
  sportsdata:any = [];
  Competition_Name: any;
  Competitions = [];
    userList = [];
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider, public toastCtrl: ToastController,public navParams: NavParams) {
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
    this.api.auth('competition_details', {
      "competition_id":this.Competition_Name.competition_id,
    }).subscribe(res => {
      this.loader.Hide();
      console.log('this.competition_details',res);
      if(res.authorization)
      {
         this.sportsdata = res.sports_type;         
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

  importlist()
  {
    this.navCtrl.push('ImportCandidateListPage');
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

