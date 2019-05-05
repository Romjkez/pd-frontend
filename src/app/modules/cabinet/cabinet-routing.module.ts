import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CabinetComponent} from './cabinet/cabinet.component';
import {CreateProjectComponent} from '../project/create-project/create-project.component';

const routes: Routes = [
  {
    path: '',
    component: CabinetComponent,
    pathMatch: 'full',
    data: {animation: 'Cabinet'},
    children: [
      {
        path: 'create_project',
        pathMatch: 'full',
        component: CreateProjectComponent,
        data: {animation: 'CreateProject'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CabinetRoutingModule {
}
