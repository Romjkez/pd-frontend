import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from './main/main-page/main-page.component';
import {UserViewComponent} from './user-view/user-view.component';
import {ProjectComponent} from './project-view/project/project.component';
import {NotFoundPageComponent} from './not-found-page/not-found-page.component';
import {RegisterComponent} from './auth/register/register.component';
import {LoginComponent} from './auth/login/login.component';
import {CabinetComponent} from './cabinet/cabinet/cabinet.component';
import {AuthGuardService} from './shared/services/auth-guard.service';

const routes: Routes = [
  {path: '', component: MainPageComponent, pathMatch: 'full',},
  {path: 'user/:id', component: UserViewComponent, pathMatch: 'full'},
  {path: 'project/:id', component: ProjectComponent, pathMatch: 'full'},
  {path: 'register', component: RegisterComponent, pathMatch: 'full'},
  {path: 'login', component: LoginComponent, pathMatch: 'full'},
  {path: 'cabinet', component: CabinetComponent, pathMatch: 'full', canActivate: [AuthGuardService]},
  {path: '404', component: NotFoundPageComponent, pathMatch: 'full'},
  {path: '**', redirectTo: '404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
