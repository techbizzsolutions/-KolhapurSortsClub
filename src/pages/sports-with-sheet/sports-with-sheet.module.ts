import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SportsWithSheetPage } from './sports-with-sheet';

@NgModule({
  declarations: [
    SportsWithSheetPage,
  ],
  imports: [
    IonicPageModule.forChild(SportsWithSheetPage),
  ],
})
export class SportsWithSheetPageModule {}
