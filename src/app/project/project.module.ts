import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectComponent} from './project/project.component';
import {CreateProjectComponent} from './project/create-project/create-project.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule, MatOptionModule, MatTooltipModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [ProjectComponent,
    CreateProjectComponent],
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
    MatInputModule
  ],
  exports: [ProjectComponent, CreateProjectComponent]
})
export class ProjectModule {
}
