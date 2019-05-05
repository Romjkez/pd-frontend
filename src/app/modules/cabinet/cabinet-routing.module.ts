import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CabinetComponent} from './cabinet/cabinet.component';
import {CreateProjectComponent} from '../project/create-project/create-project.component';

const routes: Routes = [
  {
    path: '',
    component: CabinetComponent,
    data: {animation: 'Cabinet'},
    pathMatch: 'full',
  },
  {
    path: 'create_project',
    component: CreateProjectComponent,
    data: {animation: 'CreateProject'},
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CabinetRoutingModule {
}
