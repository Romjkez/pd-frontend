import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundPageComponent} from './not-found-page/not-found-page.component';
import {ProjectComponent} from './modules/project/view-project/project.component';
import {EditProjectComponent} from './modules/project/edit-project/edit-project.component';
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
    data: {animation: 'UserView'},
    loadChildren: './modules/user/user.module#UserModule'
  },
  {
    path: 'edit_profile',
    data: {animation: 'EditProfileView'},
    loadChildren: './modules/user/user.module#UserModule'
  },
  {
    path: 'project/:id',
    component: ProjectComponent,
    pathMatch: 'full',
    data: {animation: 'ProjectView'}
  },
  {
    path: 'project/:id/edit',
    component: EditProjectComponent,
    pathMatch: 'full',
    data: {animation: 'EditProfileView'}
  },
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
    pathMatch: 'full',
    data: {animation: 'Cabinet'},
    canActivate: [AuthGuardService],
  },
  /*{
    path: 'cabinet/create_project',
    component: CreateProjectComponent,
    pathMatch: 'full',
    data: {animation: 'CreateProject'}
  },*/
  {
    path: '404',
    component: NotFoundPageComponent,
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
