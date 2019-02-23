import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NotFoundPageComponent} from './not-found-page/not-found-page.component';
import {PreloaderComponent} from './shared/components/preloader/preloader.component';
import {UserViewComponent} from './user-view/user-view.component';
import {HeaderComponent} from './header/header.component';
import {MainPageComponent} from './main/main-page/main-page.component';
import {FooterComponent} from './footer/footer.component';
import {RegisterComponent} from './auth/register/register.component';
import {LoginComponent} from './auth/login/login.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonToggle, MatButtonToggleModule, MatDialogModule, MatSnackBar, MatSnackBarModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {ProjectSnippetComponent} from './shared/components/project-snippet/project-snippet.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {CabinetModule} from './cabinet/cabinet.module';
import {ProjectComponent} from './shared/components/project/project.component';
import {GetNamePipe} from './shared/pipes/get-name.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundPageComponent,
    UserViewComponent,
    HeaderComponent,
    FooterComponent,
    RegisterComponent,
    LoginComponent,
    MainPageComponent,
    ProjectComponent,
    GetNamePipe,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    HttpClientModule,
    NgxPaginationModule,
    CabinetModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule,
    NgxPaginationModule,
    PreloaderComponent,
    CabinetModule,
    ProjectSnippetComponent,
  ],
  providers: [MatSnackBar, MatButtonToggle],
  bootstrap: [AppComponent]
})
export class AppModule {
}
