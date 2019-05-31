import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { MyApp } from './app.component';
import { Network } from '@ionic-native/network';
import { LoginPage } from '../pages/login/login';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { SMS } from '@ionic-native/sms';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SmsServiceProvider } from '../providers/sms-service/sms-service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DatePicker } from '@ionic-native/date-picker';
import { FileChooser } from '@ionic-native/file-chooser';
import { ApiProvider } from '../providers/api/api';
import { LoaderServiceProvider } from '../providers/loader-service/loader-service';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { QRScanner } from '@ionic-native/qr-scanner';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { FileOpener } from '@ionic-native/file-opener';

@NgModule({
  declarations: [
    MyApp,
    LoginPage
    ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    OpenNativeSettings,
    SMS,
    FileTransfer,
    File,
    SocialSharing,
    DatePicker,
    FileChooser,
    QRScanner,
    AndroidPermissions,
    FileOpener,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SmsServiceProvider,
    ApiProvider,
    LoaderServiceProvider
  ]
})
export class AppModule {}
