import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxPaginationModule} from 'ngx-pagination';
import {MainPageComponent} from './main-page/main-page.component';
import {SharedModule} from '../shared/shared.module';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatTooltipModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    MainPageComponent,
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    SharedModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
  ],
  exports: [MainPageComponent],
})
export class MainModule {
}
