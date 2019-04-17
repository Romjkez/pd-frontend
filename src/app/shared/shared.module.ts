import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {PreloaderComponent} from './components/preloader/preloader.component';
import {ProjectSnippetComponent} from './components/project-snippet/project-snippet.component';
import {RouterModule} from '@angular/router';
import {AdmProjectSnippetComponent} from './components/adm-project-snippet/adm-project-snippet.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProjectsComponent} from './components/projects/projects.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {ApplicationSnippetComponent} from './components/application-snippet/application-snippet.component';
import {EditableListComponent} from './components/editable-list/editable-list.component';
import {MatButtonModule, MatDialogModule, MatIconModule} from '@angular/material';


@NgModule({
  declarations: [
    PreloaderComponent,
    ProjectSnippetComponent,
    AdmProjectSnippetComponent,
    ProjectsComponent,
    ApplicationSnippetComponent,
    EditableListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  exports: [
    PreloaderComponent,
    ProjectSnippetComponent,
    AdmProjectSnippetComponent,
    ProjectsComponent,
    ApplicationSnippetComponent,
    EditableListComponent,
  ]
})
export class SharedModule {
}
