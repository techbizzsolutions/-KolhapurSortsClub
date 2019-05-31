import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import {Validators, FormBuilder } from '@angular/forms';
import { SmsServiceProvider } from '../../providers/sms-service/sms-service';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({
  selector: 'page-update-competition',
  templateUrl: 'update-competition.html',
})
export class UpdateCompetitionPage {
  Compitition:any;
  comdate:any = "Competition Date";
  comtime:any = "Competition Time"
  sportsType = [];
  constructor(public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public smsServiceProvider: SmsServiceProvider,
    public navParams: NavParams) {
     this.Compitition = this.formBuilder.group({
      CompetitionName: ['', Validators.required],
      Counters:['', Validators.required]
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad updateCompititionPage', this.navParams.data);
    this.getCompetition();
  }

  deleteitem()
  {
    let alert = this.alertCtrl.create({
      subTitle: "Do you want to delete this competition?",
      buttons: [{
        text: 'Ok',
        handler: () => {
          this.loader.Show("Loading...");
          this.api.auth('inactive_competition', {
            "competition_id":this.navParams.data.competition_id
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
  getCompetition()
  {
    this.loader.Show("Loading...");
    this.api.auth('competition_details', {
      "competition_id":this.navParams.data.competition_id
    }).subscribe(res => {
      console.log(res);
      this.loader.Hide();
      if(res.authorization)
      {
        this.Compitition = this.formBuilder.group({
          CompetitionName: [res.name, Validators.required],
          Counters:[res.counters, Validators.required]
          });
          this.comdate = res.start_date;
          this.comtime = res.start_time;
          res.all_sports_type.forEach(element => {
            element.selected = false;
            element.total = 0;
           });
          for (let index = 0; index < res.sports_type.length; index++) {
            
            for (let index1 = 0; index1 < res.all_sports_type.length; index1++) {
                if(res.sports_type[index].sports_type_id == res.all_sports_type[index1].sports_type_id )
                {
                  res.all_sports_type[index1].selected = true;
                  res.all_sports_type[index1].total = res.sports_type[index].positions;
                  break;
                }
            }
          }

          this.sportsType = res.all_sports_type;
           console.log('this.sportsType',this.sportsType);
          this.sportsType = res.all_sports_type;
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
      let toast = this.toastCtrl.create({
        message: 'Something went wrong, please try again', 
        position: 'top',
        duration: 3000
      });
      toast.present();
    })
  }

  
  getDate()
  {
      this.smsServiceProvider.getDate().then(res=>{
        this.comdate = res;
      })
  }

  getTime()
  {
    this.smsServiceProvider.getTime().then(res=>{
      this.comtime = res;
    })
  }

  create()
  {
    if(this.comdate === "Competition Date")
    {
      let toast = this.toastCtrl.create({
        message: 'Please select Competition Date',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
    if(this.comtime === "Competition Time")
    {
      let toast = this.toastCtrl.create({
        message: 'Please select Competition Time',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
    var check = false;
    let apicall= true;
    var arry = [];
    this.sportsType.forEach(element => {
        if(element.selected)
        {
          if(element.total !=0)
          {
            check = true;
            arry.push({
              "positions":element.total,
              "sports_type_id":element.sports_type_id
            });
          }
          else{
            check = true;
            let toast = this.toastCtrl.create({
              message: 'Please select No. of position of selected Sports',
              position: 'top',
              duration: 3000
            });
            toast.present();
            apicall = false;
            return;
          }
         
        }
    });
    if(!check)
    {
      let toast = this.toastCtrl.create({
        message: 'Please select Sports Type',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }

    if(apicall)
    {
      this.loader.Show("Updating...");
      this.api.auth('update_competition', {
        "competition_id":this.navParams.data.competition_id,
        "name":this.Compitition.value.CompetitionName,
        "start_date":this.comdate,
        "start_time":this.comtime,
        "counters":this.Compitition.value.Counters,
        "sports_types": arry 
      }).subscribe(res => {
        this.loader.Hide();
        console.log('this.res',res);
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
    
  }
}

