import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserViewComponent} from './user-view/user-view.component';
import {UserEditComponent} from './user-edit/user-edit.component';

const routes: Routes = [
  {
    path: ':id',
    component: UserViewComponent,
    data: {animation: 'UserView'},
    pathMatch: 'full'
  },
  {
    path: ':id/edit',
    component: UserEditComponent,
    data: {animation: 'EditProfileView'},
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class UserRoutingModule {
}
