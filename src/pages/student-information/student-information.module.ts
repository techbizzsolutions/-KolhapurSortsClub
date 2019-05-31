import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StudentInformationPage } from './student-information';

@NgModule({
  declarations: [
    StudentInformationPage,
  ],
  imports: [
    IonicPageModule.forChild(StudentInformationPage),
  ],
})
export class StudentInformationPageModule {}
