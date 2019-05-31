import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateInformationPage } from './create-information';

@NgModule({
  declarations: [
    CreateInformationPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateInformationPage),
  ],
})
export class CreateInformationPageModule {}
