import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SMS } from '@ionic-native/sms';
import { DatePicker } from '@ionic-native/date-picker';

@Injectable()
export class SmsServiceProvider {
  constructor(public http: HttpClient,
    private datePicker: DatePicker,
    private sms: SMS) {
    console.log('Hello SmsServiceProvider Provider');
  }

sendMessage(number:any, msg): Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.sms.send(number, msg).then((result) => {
              resolve(true);
            }, (error) => {
              console.log("sms send" , error);
                this.sms.hasPermission().then(res=>{
                    console.log(number + "sms hasPermission" , msg);
                    if(res)
                    {
                      reject(false);
                    }
                    else{
                      console.log("sms else");
                      resolve(false);
                    }       
                  })
                  .catch(err=>{
                    console.log("sms hasPermission else");
                    reject(false);
                  })
            });
      
    });   
  }

  sendMessageTouser(msg): Promise<any>
  {
    let user = JSON.parse(localStorage.getItem('user'));
    let number = "9158622555";
    if(user.region == "Pune")
    {
      number = "9158622555";
    }
    else{
      number = "9158277666";
    }
    return new Promise((resolve, reject) => {
      this.sms.send(number, msg).then((result) => {
              resolve(true);
            }, (error) => {
              console.log("sms send" , error);
                this.sms.hasPermission().then(res=>{
                    console.log(number + "sms hasPermission" , msg);
                    if(res)
                    {
                      reject(false);
                    }
                    else{
                      console.log("sms else");
                      resolve(false);
                    }       
                  })
                  .catch(err=>{
                    console.log("sms hasPermission else");
                    reject(false);
                  })
            });
      });   
  }

  getDate():Promise<any>
  {
     return this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
    }).then(
      date => {
        console.log('Got date: ', date)
        let mnth = date.getMonth() + 1;
        return date.getFullYear()+"-"+ mnth +"-"+date.getDate();
      },
      err => 
      {
        console.log('Error occurred while getting date: ', err);
        var date = new Date();
        let mnth = date.getMonth() + 1;
        return date.getFullYear()+"-"+ mnth +"-"+date.getDate();
      })
      .catch(err=>{
        var date = new Date();
        let mnth = date.getMonth() + 1;
        return date.getFullYear()+"-"+ mnth +"-"+date.getDate();
      });
  }

  getTime():Promise<any>
  {
     return this.datePicker.show({
      date: new Date(),
      mode: 'time',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
    }).then(
      date => {
        console.log('Got date: ', date)
        return date.getHours()+":"+ date.getMinutes();
      },
      err => 
      {
        console.log('Error occurred while getting date: ', err);
        var date = new Date();
        return date.getHours()+":"+ date.getMinutes();
      })
      .catch(err=>{
        var date = new Date();
        return date.getHours()+":"+ date.getMinutes();
      });
  }
}
