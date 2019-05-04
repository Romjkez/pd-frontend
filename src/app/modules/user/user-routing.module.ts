import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserViewComponent} from './user-view/user-view.component';
import {UserEditComponent} from './user-edit/user-edit.component';

const routes: Routes = [
  {
    path: ':id',
    component: UserViewComponent,
    pathMatch: 'full'
  },
  {
    path: '',
    component: UserEditComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
