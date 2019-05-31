import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import {Validators, FormBuilder } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({
  selector: 'page-student-information',
  templateUrl: 'student-information.html',
})
export class StudentInformationPage {
  Candidate:any;
  bidnumber:any;
  Competition_Name:any;
  Competitions = [];
  Sports=[];
  Sport:any;
  tshirts =[];
  tshirt:any;
  Ages = [];
  Age:any;
  Gender:any = 'Male';
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider, public formBuilder: FormBuilder,public toastCtrl: ToastController,public navParams: NavParams) {
    this.Candidate = this.formBuilder.group({
      Bidno: ['', Validators.required],
      Name:['', Validators.required],
      Email: ["", Validators.compose([
        Validators.required,
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      ])]
      });
  }

  select(item)
  {
    console.log('ionViewDidLoad CreateInformationPage',item);
    this.Competition_Name = item;
    this.getSportsType(item.competition_id);
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

  compareFn(e1: any, e2: any): boolean {
    return e1 && e2 ? e1.sports_type_id === e2.sports_type_id : e1 === e2;
  }

  search()
  {
    if(!this.Competition_Name)
    {
      let toast = this.toastCtrl.create({
        message: 'Please select Competition Name',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
     if(this.bidnumber)
     {
      this.loader.Show("Loading...");
      this.api.auth('search_bib', {
        "competition_id":this.Competition_Name.competition_id,
        "search":this.bidnumber
      }).subscribe(res => {
        this.loader.Hide();
        console.log('this.search_bib',res);
        if(res.authorization)
        {
          let gend = 'Male';
           if(res.gender)
           {
            gend = res.gender;
           }
          this.Candidate = this.formBuilder.group({
            Bidno: [res.bib_no, Validators.required],
            Name:[res.name, Validators.required],
            Email: [res.email, Validators.compose([
              Validators.required,
              Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
            ])]
            });
            this.Age = res.age_group;
            this.tshirt = res.tshirt;
            this.tshirts = res.tshirt_listings; 
            this.Ages = res.age_group_listings;
            this.Sport = {'sports_type_id': res.sports_type_id, 'sports_type_name': res.sports_type};
            this.Sports = this.Sports;
            this.Gender = gend;
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
     else{
      let toast = this.toastCtrl.create({
        message: 'Please enter Bid no.',
        position: 'top',
        duration: 3000
      });
      toast.present();
     }
  }

  create()
  {
    console.log('StudentInformationPage', this.Candidate.value);
    if(!this.Sport)
    {
     let toast = this.toastCtrl.create({
       message: 'Please select Sports type',
       position: 'top',
       duration: 3000
     });
     toast.present();
     return;
    }
    if(!this.tshirt)
    {
      let toast = this.toastCtrl.create({
        message: 'Please select T-shirt size',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
    if(!this.Age)
    {
      let toast = this.toastCtrl.create({
        message: 'Please select age group',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
    console.log('StudentInformationPage', this.Sport);
    this.loader.Show("Loading...");
    this.api.auth('update_participant', {
      "competition_id":this.Competition_Name.competition_id,
      "sports_type_id":this.Sport.sports_type_id,
      "bib_no":this.Candidate.value.Bidno,
      "name":this.Candidate.value.Name,
      "age_group":this.Age,
      "gender":this.Gender,
      "tshirt":this.tshirt,
      "email":this.Candidate.value.Email
    }).subscribe(res => {
      this.loader.Hide();
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
    console.log('ionViewDidLoad StudentInformationPage');
    this.getCompetition();
  }

}
