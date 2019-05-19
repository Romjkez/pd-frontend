import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ProjectComponent} from './view-project/project.component';
import {EditProjectComponent} from './edit-project/edit-project.component';

const routes: Routes = [
  {
    path: ':id',
    component: ProjectComponent,
    data: {animation: 'ProjectView'},
  },
  {
    path: ':id/edit',
    component: EditProjectComponent,
    data: {animation: 'EditProfileView'},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ProjectRoutingModule {
}
