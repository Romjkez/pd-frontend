import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WorkerCabinetComponent} from './cabinet/worker-cabinet/worker-cabinet.component';
import {AdminCabinetComponent} from './cabinet/admin-cabinet/admin-cabinet.component';
import {CuratorCabinetComponent} from './cabinet/curator-cabinet/curator-cabinet.component';
import {CabinetComponent} from './cabinet/cabinet.component';
import {MatTabsModule} from '@angular/material';
import {ProjectSnippetComponent} from '../shared/components/project-snippet/project-snippet.component';
import {PreloaderComponent} from '../preloader/preloader.component';
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
  declarations: [
    WorkerCabinetComponent,
    AdminCabinetComponent,
    CuratorCabinetComponent,
    CabinetComponent,
    ProjectSnippetComponent,
    PreloaderComponent
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    NgxPaginationModule
  ],
  exports: [WorkerCabinetComponent,
    AdminCabinetComponent,
    CuratorCabinetComponent,
    CabinetComponent,
    PreloaderComponent,
    ProjectSnippetComponent],
})
export class CabinetModule {
}
