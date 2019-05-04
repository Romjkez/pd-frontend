import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WorkerCabinetComponent} from './cabinet/worker-cabinet/worker-cabinet.component';
import {AdminCabinetComponent} from './cabinet/admin-cabinet/admin-cabinet.component';
import {CuratorCabinetComponent} from './cabinet/curator-cabinet/curator-cabinet.component';
import {CabinetComponent} from './cabinet/cabinet.component';
import {MatDialogModule, MatTabsModule} from '@angular/material';
import {NgxPaginationModule} from 'ngx-pagination';
import {AppRoutingModule} from '../app-routing.module';
import {SharedModule} from '../modules/shared/shared.module';

@NgModule({
  declarations: [
    WorkerCabinetComponent,
    AdminCabinetComponent,
    CuratorCabinetComponent,
    CabinetComponent,
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    NgxPaginationModule,
    AppRoutingModule,
    SharedModule,
    MatDialogModule,
  ]
})
export class CabinetModule {
}
