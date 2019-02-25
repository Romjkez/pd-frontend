import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectComponent} from './project/project.component';
import {CreateProjectComponent} from './project/create-project/create-project.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [ProjectComponent,
    CreateProjectComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [ProjectComponent, CreateProjectComponent]
})
export class ProjectModule {
}
