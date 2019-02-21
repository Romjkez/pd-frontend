import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxPaginationModule} from 'ngx-pagination';
import {MainPageComponent} from './main-page/main-page.component';
import {ProjectSnippetComponent} from '../shared/components/project-snippet/project-snippet.component';

@NgModule({
  declarations: [
    MainPageComponent,
    ProjectSnippetComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
  ],
  exports: [MainPageComponent]
})
export class MainModule {
}
