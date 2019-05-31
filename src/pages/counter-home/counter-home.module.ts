import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CounterHomePage } from './counter-home';

@NgModule({
  declarations: [
    CounterHomePage,
  ],
  imports: [
    IonicPageModule.forChild(CounterHomePage),
  ],
})
export class CounterHomePageModule {}
