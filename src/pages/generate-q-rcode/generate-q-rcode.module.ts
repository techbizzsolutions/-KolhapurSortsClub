import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GenerateQRcodePage } from './generate-q-rcode';

@NgModule({
  declarations: [
    GenerateQRcodePage,
  ],
  imports: [
    IonicPageModule.forChild(GenerateQRcodePage),
  ],
})
export class GenerateQRcodePageModule {}
