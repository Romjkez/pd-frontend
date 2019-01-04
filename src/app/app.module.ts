import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NotFoundPageComponent} from './not-found-page/not-found-page.component';
import {PreloaderComponent} from './preloader/preloader.component';
import {UserViewComponent} from './user-view/user-view.component';
import {HeaderComponent} from './header/header.component';
import {MainPageComponent} from './main-page/main-page.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundPageComponent,
    PreloaderComponent,
    UserViewComponent,
    HeaderComponent,
    MainPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
