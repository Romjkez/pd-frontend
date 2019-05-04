import {NgModule} from '@angular/core';
import {FileUploadInputForDirective} from './fileUploadInputFor.directive';

import {MatButtonModule, MatCardModule, MatDialogModule, MatProgressBarModule} from '@angular/material';
import {MatIconModule} from '@angular/material/icon';
import {HttpClientModule} from '@angular/common/http';
import {BytesPipe} from './bytes.pipe';
import {CommonModule} from '@angular/common';
import {AppFileUploadQueueComponent} from './app-file-upload-queue/app-file-upload-queue.component';
import {AppFileUploadComponent} from './app-file-upload/app-file-upload.component';
import {FileUploadModalComponent} from './file-upload-modal/file-upload-modal.component';


@NgModule({
  imports: [
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    MatCardModule,
    HttpClientModule,
    CommonModule,
    MatDialogModule
  ],
  declarations: [
    AppFileUploadComponent,
    FileUploadInputForDirective,
    BytesPipe,
    AppFileUploadQueueComponent,
    FileUploadModalComponent
  ],
  exports: [
    AppFileUploadComponent,
    AppFileUploadQueueComponent,
    FileUploadInputForDirective,
    BytesPipe,
  ],
  entryComponents: [FileUploadModalComponent]
})
export class AppFileUploadModule {
}
