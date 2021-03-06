import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NotFoundPageComponent} from './components/not-found-page/not-found-page.component';
import {HeaderComponent} from './components/header/header.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatDialogModule,
  MatExpansionModule,
  MatIconModule,
  MatMenuModule,
  MatSnackBarModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgxPaginationModule} from 'ngx-pagination';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MainModule} from './modules/main/main.module';
import {AuthModule} from './modules/auth/auth.module';
import {SharedModule} from './modules/shared/shared.module';
import {AuthInterceptor} from './modules/shared/services/auth.interceptor';

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
    AuthModule,
    MainModule,
    SharedModule,
    MatMomentDateModule,
    MatExpansionModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule,
    NgxPaginationModule,
    HeaderComponent,
    MatIconModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
