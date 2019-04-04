import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NotFoundPageComponent} from './not-found-page/not-found-page.component';
import {HeaderComponent} from './header/header.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonToggle,
  MatButtonToggleModule,
  MatDialogModule,
  MatExpansionModule,
  MatSnackBar,
  MatSnackBarModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgxPaginationModule} from 'ngx-pagination';
import {CabinetModule} from './cabinet/cabinet.module';
import {AuthModule} from './auth/auth.module';
import {MainModule} from './main/main.module';
import {SharedModule} from './shared/shared.module';
import {ProjectModule} from './project/project.module';
import {MatMomentDateModule} from '@angular/material-moment-adapter';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundPageComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    MatDialogModule,
    HttpClientModule,
    NgxPaginationModule,
    CabinetModule,
    AuthModule,
    MainModule,
    SharedModule,
    ProjectModule,
    MatMomentDateModule,
    MatExpansionModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule,
    NgxPaginationModule,
    CabinetModule,
    HeaderComponent
  ],
  providers: [MatSnackBar, MatButtonToggle],
  bootstrap: [AppComponent]
})
export class AppModule {
}
