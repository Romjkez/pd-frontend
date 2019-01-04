import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from './main-page/main-page.component';
import {UserViewComponent} from './user-view/user-view.component';
import {ProjectComponent} from './project-view/project/project.component';
import {NotFoundPageComponent} from './not-found-page/not-found-page.component';
import {RegisterComponent} from './auth/register/register.component';
import {LoginComponent} from './auth/login/login.component';
import {CabinetComponent} from './cabinet/cabinet/cabinet.component';

const routes: Routes = [
    {path: '', component: MainPageComponent, pathMatch: 'full'},
    {path: 'user/:id', component: UserViewComponent, pathMatch: 'full'},
    {path: 'project/:id', component: ProjectComponent, pathMatch: 'full'},
    {path: 'register', component: RegisterComponent, pathMatch: 'full'},
    {path: 'login', component: LoginComponent, pathMatch: 'full'},
    {path: 'cabinet', component: CabinetComponent, pathMatch: 'full'},
    {path: '**', component: NotFoundPageComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
