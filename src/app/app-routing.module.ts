import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from './main/main-page/main-page.component';
import {UserViewComponent} from './user-view/user-view.component';
import {ProjectComponent} from './project/project/project.component';
import {NotFoundPageComponent} from './not-found-page/not-found-page.component';
import {RegisterComponent} from './auth/register/register.component';
import {LoginComponent} from './auth/login/login.component';
import {CabinetComponent} from './cabinet/cabinet/cabinet.component';
import {AuthGuardService} from './shared/services/auth-guard.service';
import {CreateProjectComponent} from './project/project/create-project/create-project.component';
import {UserEditComponent} from './user-view/user-edit/user-edit.component';

const routes: Routes = [
  {path: '', component: MainPageComponent, pathMatch: 'full', data: {animation: 'MainPage'}},
  {path: 'user/:id', component: UserViewComponent, pathMatch: 'full', data: {animation: 'UserView'}},
  {path: 'edit_profile', component: UserEditComponent, pathMatch: 'full'},
  {path: 'project/:id', component: ProjectComponent, pathMatch: 'full', data: {animation: 'ProjectView'}},
  {path: 'register', component: RegisterComponent, pathMatch: 'full', data: {animation: 'RegisterView'}},
  {path: 'login', component: LoginComponent, pathMatch: 'full', data: {animation: 'LoginView'}},
  {path: 'cabinet', component: CabinetComponent, pathMatch: 'full', canActivate: [AuthGuardService], data: {animation: 'Cabinet'}},
  {path: 'cabinet/create_project', component: CreateProjectComponent, pathMatch: 'full', data: {animation: 'CreateProject'}},
  {path: '404', component: NotFoundPageComponent, pathMatch: 'full'},
  {path: '**', redirectTo: '404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
