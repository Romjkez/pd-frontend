import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NotFoundPageComponent} from './not-found-page/not-found-page.component';
import {UserViewComponent} from './user-view/user-view.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonToggle, MatButtonToggleModule, MatDialogModule, MatSnackBar, MatSnackBarModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgxPaginationModule} from 'ngx-pagination';
import {CabinetModule} from './cabinet/cabinet.module';
import {AuthModule} from './auth/auth.module';
import {MainModule} from './main/main.module';
import {SharedModule} from './shared/shared.module';
import { CreateProjectComponent } from './project/create-project/create-project.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundPageComponent,
    UserViewComponent,
    HeaderComponent,
    FooterComponent,
    CreateProjectComponent,
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
    AuthModule,
    MainModule,
    SharedModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule,
    NgxPaginationModule,
    CabinetModule,
  ],
  providers: [MatSnackBar, MatButtonToggle],
  bootstrap: [AppComponent]
})
export class AppModule {
}
