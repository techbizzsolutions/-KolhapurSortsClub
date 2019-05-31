import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImportCandidateListPage } from './import-candidate-list';
import { ProgressBarComponent } from '../../components/progress-bar/progress-bar';

@NgModule({
  declarations: [
    ImportCandidateListPage,
    ProgressBarComponent
  ],
  imports: [
    IonicPageModule.forChild(ImportCandidateListPage),
  ],
})
export class ImportCandidateListPageModule {}
