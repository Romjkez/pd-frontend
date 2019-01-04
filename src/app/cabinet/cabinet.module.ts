import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WorkerCabinetComponent} from './cabinet/worker-cabinet/worker-cabinet.component';
import {AdminCabinetComponent} from './cabinet/admin-cabinet/admin-cabinet.component';
import {CuratorCabinetComponent} from './cabinet/curator-cabinet/curator-cabinet.component';
import {CabinetComponent} from './cabinet/cabinet.component';

@NgModule({
  declarations: [WorkerCabinetComponent, AdminCabinetComponent, CuratorCabinetComponent, CabinetComponent],
  imports: [
    CommonModule
  ]
})
export class CabinetModule { }
