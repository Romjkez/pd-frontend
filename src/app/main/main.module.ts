import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxPaginationModule} from 'ngx-pagination';
import {MainPageComponent} from './main-page/main-page.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    MainPageComponent,
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    SharedModule
  ],
  exports: [MainPageComponent]
})
export class MainModule {
}
