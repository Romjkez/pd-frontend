import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WorkerCabinetComponent} from './worker-cabinet/worker-cabinet.component';
import {AdminCabinetComponent} from './admin-cabinet/admin-cabinet.component';
import {CuratorCabinetComponent} from './curator-cabinet/curator-cabinet.component';
import {CabinetComponent} from './cabinet/cabinet.component';
import {MatDialogModule, MatTabsModule} from '@angular/material';
import {NgxPaginationModule} from 'ngx-pagination';
import {SharedModule} from '../shared/shared.module';
import {CabinetRoutingModule} from './cabinet-routing.module';
import {RouterModule} from '@angular/router';
import {ProjectModule} from '../project/project.module';

@NgModule({
  declarations: [
    WorkerCabinetComponent,
    AdminCabinetComponent,
    CuratorCabinetComponent,
    CabinetComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    CabinetRoutingModule,
    MatTabsModule,
    NgxPaginationModule,
    SharedModule,
    MatDialogModule,
    ProjectModule,
  ],
})
export class CabinetModule {
}
