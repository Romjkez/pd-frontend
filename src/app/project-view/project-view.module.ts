import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectComponent} from './project/project.component';
import {ProjectSnippetComponent} from './project-snippet/project-snippet.component';

@NgModule({
  declarations: [ProjectComponent, ProjectSnippetComponent],
  imports: [
    CommonModule
  ]
})
export class ProjectViewModule { }
