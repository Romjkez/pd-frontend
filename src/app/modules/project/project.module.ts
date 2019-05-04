import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectComponent} from './view-project/project.component';
import {CreateProjectComponent} from './create-project/create-project.component';
import {RouterModule} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MatButtonModule,
  MatDatepickerModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatOptionModule,
  MatTooltipModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {EditProjectComponent} from './edit-project/edit-project.component';
import {ProjectFormComponent} from './project-form/project-form.component';
import {MessageBoardComponent} from './message-board/message-board.component';
import {AppFileUploadModule} from '../appFileUpload/appFileUpload.module';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    ProjectComponent,
    CreateProjectComponent,
    EditProjectComponent,
    ProjectFormComponent,
    MessageBoardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MatTooltipModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatDatepickerModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    AppFileUploadModule
  ],
  exports: [ProjectComponent, CreateProjectComponent, MatIconModule],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_LOCALE, useValue: 'ru'},
  ],
})
export class ProjectModule {
}
