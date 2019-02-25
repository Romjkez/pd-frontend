import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {PreloaderComponent} from './components/preloader/preloader.component';
import {ProjectSnippetComponent} from './components/project-snippet/project-snippet.component';
import {GetNamePipe} from './pipes/get-name.pipe';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    PreloaderComponent,
    ProjectSnippetComponent,
    GetNamePipe,
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    PreloaderComponent,
    ProjectSnippetComponent,
    GetNamePipe,
  ],
})
export class SharedModule {
}
