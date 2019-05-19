import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundPageComponent} from './components/not-found-page/not-found-page.component';
import {MainPageComponent} from './modules/main/main-page/main-page.component';
import {RegisterComponent} from './modules/auth/register/register.component';
import {LoginComponent} from './modules/auth/login/login.component';
import {AuthGuardService} from './modules/shared/services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    pathMatch: 'full',
    data: {animation: 'MainPage'}
  },
  {
    path: 'log',
    loadChildren: './modules/logs/logs.module#LogsModule'
  },
  {
    path: 'user',
    loadChildren: './modules/user/user.module#UserModule'
  },
  {
    path: 'project',
    loadChildren: './modules/project/project.module#ProjectModule'
  },
  /*{
    path: 'project',
    component: EditProjectComponent,
    pathMatch: 'full',
    data: {animation: 'EditProfileView'}
  },*/
  {
    path: 'register',
    component: RegisterComponent,
    pathMatch: 'full',
    data: {animation: 'RegisterView'}
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full',
    data: {animation: 'LoginView'}
  },
  {
    path: 'cabinet',
    loadChildren: './modules/cabinet/cabinet.module#CabinetModule',
    data: {animation: 'Cabinet'},
    canActivate: [AuthGuardService],
  },
  {
    path: '404',
    component: NotFoundPageComponent,
    pathMatch: 'full'
  },
  /*{
    path: '**',
    redirectTo: '404'
  }*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
