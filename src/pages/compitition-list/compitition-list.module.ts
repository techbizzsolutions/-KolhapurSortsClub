import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompititionListPage } from './compitition-list';

@NgModule({
  declarations: [
    CompititionListPage,
  ],
  imports: [
    IonicPageModule.forChild(CompititionListPage),
  ],
})
export class CompititionListPageModule {}
