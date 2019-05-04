import {RouterModule, Routes} from '@angular/router';
import {LogsViewComponent} from './logs-view/logs-view.component';
import {NgModule} from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: LogsViewComponent,
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class LogsRoutingModule {
}
