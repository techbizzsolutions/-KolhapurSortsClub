import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams, ToastController } from 'ionic-angular';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-compitition-list',
  templateUrl: 'compitition-list.html',
})
export class CompititionListPage {

  competitions=[];
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public navParams: NavParams) {
  }

  getSportsType()
  {
    this.loader.Show("Loading...");
    this.api.auth('get_competition_list', {
    }).subscribe(res => {
      this.loader.Hide();
      console.log('this.get_competition_list',res);
      if(res.authorization)
      {
         this.competitions = res.lisitng;
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

  itemclick(item)
  {
    this.navCtrl.push('UpdateCompetitionPage',item);
  }

  deleteitem(item)
  {
    console.log('this.item',item);
    let alert = this.alertCtrl.create({
      subTitle: "Do you want to delete this competition?",
      buttons: [{
        text: 'Ok',
        handler: () => {
          this.loader.Show("Loading...");
          this.api.auth('inactive_competition', {
            "competition_id":item.competition_id
          }).subscribe(res => {
            this.loader.Hide();
            console.log('this.inactive_competition',res);
            if(res.authorization)
            {
              let toast = this.toastCtrl.create({
                message: res.message, 
                position: 'top',
                duration: 3000
              });
              toast.present();
              let ramainItem = [];
              for (var i = 0; i < this.competitions.length; i++) {
                if (this.competitions[i].competition_id != item.competition_id) {
                  ramainItem.push(this.competitions[i]);
                }
            }
               this.competitions = ramainItem;
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompititionListPage');
    this.getSportsType();
  }

}
