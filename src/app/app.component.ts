import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, Events, IonicApp, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SocialSharing } from '@ionic-native/social-sharing';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any;
  showedAlert: boolean = false;
  confirmAlert: any;
  user:any;
  pages: Array<{
    title: string,
    component?: any,
    icon: any
  }>;
  constructor(public platform: Platform,
    public menuCtrl: MenuController,
    public alertCtrl: AlertController,
    private ionicApp: IonicApp,
    private socialSharing: SocialSharing,
    public events: Events,
    public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
    events.subscribe('user:loggedIn', () => {
      this.user = JSON.parse(localStorage.getItem('user'));
      if(this.user.role === "Admin")
      {
        console.log("*****",this.user.role);
        this.menuCtrl.swipeEnable(true, 'menu1');

      }
      else{
        this.menuCtrl.swipeEnable(false, 'menu1');

      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString("#8B0000");
      this.splashScreen.hide();
      this.user = JSON.parse(localStorage.getItem('user'));
      // used for an example of ngFor and navigation
      this.pages = [{
          title: 'Home',
          component: 'AdminHomePage',
          icon: 'ios-home'
        },
        {
          title: 'Create Competition',
          component: 'CreateCompititionPage',
          icon: 'ios-create'
        },
        {
          title: 'Competitions List',
          component: 'CompititionListPage',
          icon: 'md-list-box'
        },
        {
          title: 'Check Sports Sheet',
          component: 'SportsWithSheetPage',
          icon: 'md-list-box'
        },
        {
          title: 'User Information',
          component: 'CreateInformationPage',
          icon: 'md-information-circle'
        },
        {
          title: 'Generate QR Code',
          component: 'GenerateQRcodePage',
          icon: 'md-qr-scanner'
        },
        {
          title: 'Import Candidate List',
          component: 'ImportCandidateListPage',
          icon: 'md-cloud-upload'
        },
        {
          title: 'Spot Student Information',
          component: 'StudentInformationPage',
          icon: 'md-person'
        },
        {
          title: 'Start Competition',
          component: 'StartCompetitionPage',
          icon: 'md-time'
        },
        {
          title: 'Start Swimming Competition',
          component: 'StartCompetitionSwimmingPage',
          icon: 'md-time'
        },
        {
          title: 'View Users',
          component: 'ViewUserPage',
          icon: 'md-people'
        },
        {
          title: 'Contact Us',
          icon: 'md-contact',
          component: 'ContactUsPage',
        },
        {
          title: 'Log Out',
          icon: 'md-log-out'
        }];
        if (this.user) {
          switch(this.user.role)
          {
            case 'Admin':
            this.menuCtrl.swipeEnable(true, 'menu1');
            this.rootPage = 'AdminHomePage';
            break;
            case 'Counter':
            this.menuCtrl.swipeEnable(false, 'menu1');
            this.rootPage = 'CounterHomePage';
            break;
            case 'Position':
            this.menuCtrl.swipeEnable(false, 'menu1');
            this.rootPage = 'PositionHomePage';
            break;
            default:
            this.menuCtrl.swipeEnable(false, 'menu1');
            this.rootPage = LoginPage;
          }
      
        } else {
          this.menuCtrl.swipeEnable(false, 'menu1');
          this.rootPage = LoginPage;
        }
        this.platform.registerBackButtonAction(() => {
          let activePortal = this.ionicApp._loadingPortal.getActive() || this.ionicApp._overlayPortal.getActive();
          this.menuCtrl.close();
  
          if (activePortal) {
            activePortal.dismiss();
            activePortal.onDidDismiss(() => {
            });
            //return;
          }
  
          if (this.ionicApp._modalPortal.getActive()) {
            this.ionicApp._modalPortal.getActive().dismiss();
            this.ionicApp._modalPortal.getActive().onDidDismiss(() => {
            });
            return;
          }
          if (this.nav.length() == 1) {
            if (!this.showedAlert) {
              this.confirmExitApp();
            } else {
              this.showedAlert = false;
              this.confirmAlert.dismiss();
            }
          }
          if (this.nav.canGoBack()) {
            this.nav.pop();
          }
  
        });
    });
  }

    // confirmation pop up to exit from app 
    confirmExitApp() {
      this.showedAlert = true;
      this.confirmAlert = this.alertCtrl.create({
        subTitle: "Do you want to exit from the app?",
        buttons: [
          {
            text: 'NO',
            handler: () => {
              this.showedAlert = false;
              return;
            }
          },
          {
            text: 'YES',
            handler: () => {
              this.platform.exitApp();
            }
          }
        ]
      });
      this.confirmAlert.present();
    }

  openPage(page) {
    console.log("*****",page);
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
      switch(page.title)
      {
        case 'Home':
        this.nav.setRoot(page.component);
        break;
        case 'Rate Us':
        this.rateUs();
        break;
        case 'Share App':
        this.shareApp();
        break;
        case 'Log Out':
        localStorage.clear();
        this.menuCtrl.swipeEnable(false, 'menu1');
        this.nav.setRoot(LoginPage);
        break;
        default:
        {
          this.nav.push(page.component);
        }
      }
  }

  shareApp()
  {
    let msg = "Law Protectors App is mainly for Their Customers who wants to register their Trademark, Copyright Application. Through this app They can easily fill up the form details and submit to the Company Authorized Representative.";
      // Check if sharing via email is supported
      this.socialSharing.share(msg, null, null, 'https://play.google.com/store/apps/details?id=com.technotwit.lowprotector').then(() => {
        // Sharing via email is possible
      }).catch(() => {
        // Sharing via email is not possible
      });
  }

  rateUs()
  {
    window.open("https://play.google.com/store/apps/details?id=com.technotwit.lowprotector", '_system');
  }

}
