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
    loadChildren: () => import('./modules/logs/logs.module').then(m => m.LogsModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule)
  },
  {
    path: 'project',
    loadChildren: () => import('./modules/project/project.module').then(m => m.ProjectModule)
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
    loadChildren: () => import('./modules/cabinet/cabinet.module').then(m => m.CabinetModule),
    data: {animation: 'Cabinet'},
    canActivate: [AuthGuardService],
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
