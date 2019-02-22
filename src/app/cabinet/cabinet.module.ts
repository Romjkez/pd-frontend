import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WorkerCabinetComponent} from './cabinet/worker-cabinet/worker-cabinet.component';
import {AdminCabinetComponent} from './cabinet/admin-cabinet/admin-cabinet.component';
import {CuratorCabinetComponent} from './cabinet/curator-cabinet/curator-cabinet.component';
import {CabinetComponent} from './cabinet/cabinet.component';
import {MatTabsModule} from '@angular/material';
import {PreloaderComponent} from '../shared/components/preloader/preloader.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {ActiveProjectsComponent} from './cabinet/curator-cabinet/active-projects/active-projects.component';
import {PendingProjectsComponent} from './cabinet/curator-cabinet/pending-projects/pending-projects.component';
import {ArchiveProjectsComponent} from './cabinet/curator-cabinet/archive-projects/archive-projects.component';
import {ProjectSnippetComponent} from '../shared/components/project-snippet/project-snippet.component';
import {AppRoutingModule} from '../app-routing.module';

@NgModule({
  declarations: [
    WorkerCabinetComponent,
    AdminCabinetComponent,
    CuratorCabinetComponent,
    CabinetComponent,
    PreloaderComponent,
    ActiveProjectsComponent,
    PendingProjectsComponent,
    ArchiveProjectsComponent,
    ProjectSnippetComponent
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    NgxPaginationModule,
    AppRoutingModule,
  ],
  exports: [
    WorkerCabinetComponent,
    AdminCabinetComponent,
    CuratorCabinetComponent,
    CabinetComponent,
    ProjectSnippetComponent,
    PreloaderComponent,
  ],
})
export class CabinetModule {
}
