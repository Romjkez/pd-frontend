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
import {ActiveProjectsComponent} from './cabinet/curator-cabinet/active-projects/active-projects.component';
import {PendingProjectsComponent} from './cabinet/curator-cabinet/pending-projects/pending-projects.component';
import {ArchiveProjectsComponent} from './cabinet/curator-cabinet/archive-projects/archive-projects.component';

@NgModule({
  declarations: [
    WorkerCabinetComponent,
    AdminCabinetComponent,
    CuratorCabinetComponent,
    CabinetComponent,
    ProjectSnippetComponent,
    PreloaderComponent,
    ActiveProjectsComponent,
    PendingProjectsComponent,
    ArchiveProjectsComponent
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
