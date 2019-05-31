import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateCompititionPage } from './create-compitition';

@NgModule({
  declarations: [
    CreateCompititionPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateCompititionPage),
  ],
})
export class CreateCompititionPageModule {}
