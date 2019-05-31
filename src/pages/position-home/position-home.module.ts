import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PositionHomePage } from './position-home';

@NgModule({
  declarations: [
    PositionHomePage,
  ],
  imports: [
    IonicPageModule.forChild(PositionHomePage),
  ],
})
export class PositionHomePageModule {}
