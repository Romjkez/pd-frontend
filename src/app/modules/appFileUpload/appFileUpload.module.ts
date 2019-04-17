import {NgModule} from '@angular/core';
import {FileUploadInputForDirective} from './fileUploadInputFor.directive';

import {MatButtonModule, MatCardModule, MatProgressBarModule} from '@angular/material';
import {MatIconModule} from '@angular/material/icon';
import {HttpClientModule} from '@angular/common/http';
import {BytesPipe} from './bytes.pipe';
import {CommonModule} from '@angular/common';
import {AppFileUploadQueueComponent} from './app-file-upload-queue/app-file-upload-queue.component';
import {AppFileUploadComponent} from './app-file-upload/app-file-upload.component';


@NgModule({
  imports: [
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    MatCardModule,
    HttpClientModule,
    CommonModule
  ],
  declarations: [
    AppFileUploadComponent,
    FileUploadInputForDirective,
    BytesPipe,
    AppFileUploadQueueComponent
  ],
  exports: [
    AppFileUploadComponent,
    AppFileUploadQueueComponent,
    FileUploadInputForDirective,
    BytesPipe
  ]
})
export class AppFileUploadModule {
}
