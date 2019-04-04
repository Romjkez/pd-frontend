import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserRoutingModule} from './user-routing.module';
import {UserEditComponent} from './user-edit/user-edit.component';
import {UserViewComponent} from './user-view/user-view.component';
import {SharedModule} from '../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatExpansionModule} from '@angular/material';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    UserEditComponent,
    UserViewComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatExpansionModule,
  ],
})
export class UserModule {
}
