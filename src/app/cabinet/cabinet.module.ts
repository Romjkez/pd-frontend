import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WorkerCabinetComponent} from './cabinet/worker-cabinet/worker-cabinet.component';
import {AdminCabinetComponent} from './cabinet/admin-cabinet/admin-cabinet.component';
import {CuratorCabinetComponent} from './cabinet/curator-cabinet/curator-cabinet.component';
import {CabinetComponent} from './cabinet/cabinet.component';
import {MatDialogModule, MatMenuModule, MatTabsModule} from '@angular/material';
import {NgxPaginationModule} from 'ngx-pagination';
import {ActiveProjectsComponent} from './cabinet/curator-cabinet/active-projects/active-projects.component';
import {PendingProjectsComponent} from './cabinet/curator-cabinet/pending-projects/pending-projects.component';
import {ArchiveProjectsComponent} from './cabinet/curator-cabinet/archive-projects/archive-projects.component';
import {AppRoutingModule} from '../app-routing.module';
import {SharedModule} from '../modules/shared/shared.module';

@NgModule({
  declarations: [
    WorkerCabinetComponent,
    AdminCabinetComponent,
    CuratorCabinetComponent,
    CabinetComponent,
    ActiveProjectsComponent,
    PendingProjectsComponent,
    ArchiveProjectsComponent,
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    NgxPaginationModule,
    AppRoutingModule,
    SharedModule,
    MatMenuModule,
    MatDialogModule,
  ],
  exports: [
    WorkerCabinetComponent,
    AdminCabinetComponent,
    CuratorCabinetComponent,
    CabinetComponent,
  ],
})
export class CabinetModule {
}
