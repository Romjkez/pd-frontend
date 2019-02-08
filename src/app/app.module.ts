import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NotFoundPageComponent} from './not-found-page/not-found-page.component';
import {PreloaderComponent} from './preloader/preloader.component';
import {UserViewComponent} from './user-view/user-view.component';
import {HeaderComponent} from './header/header.component';
import {MainPageComponent} from './main/main-page/main-page.component';
import {FooterComponent} from './footer/footer.component';
import {ProjectComponent} from './project-view/project/project.component';
import {RegisterComponent} from './auth/register/register.component';
import {LoginComponent} from './auth/login/login.component';
import {CabinetComponent} from './cabinet/cabinet/cabinet.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {TokenInterceptor} from './auth/token.interceptor';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonToggle, MatButtonToggleModule, MatDialogModule, MatSnackBar, MatSnackBarModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundPageComponent,
    PreloaderComponent,
    UserViewComponent,
    HeaderComponent,
    MainPageComponent,
    FooterComponent,
    ProjectComponent,
    RegisterComponent,
    LoginComponent,
    CabinetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    HttpClientModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule,
    HttpClientModule
  ],
  providers: [MatSnackBar, MatButtonToggle, {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
