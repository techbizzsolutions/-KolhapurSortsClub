import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubmitUserPage } from './submit-user';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  declarations: [
    SubmitUserPage,
  ],
  imports: [
    SignaturePadModule,
    IonicPageModule.forChild(SubmitUserPage),
  ],
})
export class SubmitUserPageModule {}
