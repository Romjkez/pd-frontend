import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from './main/main-page/main-page.component';
import {ProjectComponent} from './project/project/project.component';
import {NotFoundPageComponent} from './not-found-page/not-found-page.component';
import {RegisterComponent} from './auth/register/register.component';
import {LoginComponent} from './auth/login/login.component';
import {CabinetComponent} from './cabinet/cabinet/cabinet.component';
import {AuthGuardService} from './shared/services/auth-guard.service';
import {CreateProjectComponent} from './project/project/create-project/create-project.component';
import {EditProjectComponent} from './project/project/edit-project/edit-project.component';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    pathMatch: 'full',
    data: {animation: 'MainPage'}
  },
  {
    path: 'log',
    loadChildren: './logs/logs.module#LogsModule'
  },
  {
    path: 'user',
    data: {animation: 'UserView'},
    loadChildren: './user/user.module#UserModule'
  },
  {
    path: 'edit_profile',
    data: {animation: 'EditProfileView'},
    loadChildren: './user/user.module#UserModule'
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
    component: CabinetComponent,
    pathMatch: 'full',
    data: {animation: 'Cabinet'},
    canActivate: [AuthGuardService],
  },
  {
    path: 'cabinet/create_project',
    component: CreateProjectComponent,
    pathMatch: 'full',
    data: {animation: 'CreateProject'}
  },
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
