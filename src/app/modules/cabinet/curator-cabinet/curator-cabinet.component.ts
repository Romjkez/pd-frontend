import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Project} from '../../shared/models/project.model';
import {ProjectsService} from '../../shared/services/projects.service';
import {AuthService} from '../../shared/services/auth.service';
import {parseJwt} from '../../shared/utils/functions.util';

@Component({
  selector: 'app-curator-cabinet',
  templateUrl: './curator-cabinet.component.html',
  styleUrls: ['./curator-cabinet.component.css']
})
export class CuratorCabinetComponent implements OnInit {
  activeProjects: Project[] | null;
  pendingProjects: Project[] | null;
  archiveProjects: Project[] | null;
  curatorId: number;
  loading: boolean;
  currentPage = {
    active: 1,
    pending: 1,
    archive: 1
  };
  totalPages = {
    active: 0,
    pending: 0,
    archive: 0
  };
  perPage = 5;

  constructor(private projectsService: ProjectsService, private authService: AuthService, private snackBar: MatSnackBar) {
  }

  async ngOnInit() {
    this.loading = true;
    this.curatorId = parseJwt(this.authService.getToken()).data.id;
    await Promise.all([
      this.projectsService.getProjectsByStatusAndCurator(12, this.curatorId, this.perPage, this.currentPage.active),
      this.projectsService.getArchiveProjectsByCurator(this.curatorId, this.perPage, this.currentPage.archive),
      this.projectsService.getProjectsByStatusAndCurator(30, this.curatorId, this.perPage, this.currentPage.pending)
    ]).then(([activeProjects, archiveProjects, pendingProjects]) => {
        if (activeProjects.data) {
          this.activeProjects = activeProjects.data;
          this.totalPages.active = activeProjects.pages;
        }
        if (archiveProjects.data) {
          this.archiveProjects = archiveProjects.data;
          this.totalPages.archive = archiveProjects.pages;
        }
        if (pendingProjects.data) {
          this.pendingProjects = pendingProjects.data;
          this.totalPages.pending = pendingProjects.pages;
        }
      }
    ).catch(e => {
      console.error(e);
      this.snackBar.open(`Не удалось загрузить проекты: ${e.error.message}`, 'Закрыть', {duration: 5000});
    }).finally(() => this.loading = false);
  }

  async switchPage(ev: { newPage: number, id: string }) {
    switch (ev.id) {
      case 'active': {
        await this.projectsService.getProjectsByStatusAndCurator(12, this.curatorId, this.perPage, ev.newPage)
          .then(res => {
            if (res.data) {
              this.activeProjects = res.data;
              this.totalPages.active = res.pages;
              this.currentPage.active = res.page;
            }
          }).catch(e => {
            console.error(e);
            this.snackBar.open(`Не удалось загрузить проекты: ${e.error.message}`, 'Закрыть', {duration: 5000});
          });
        break;
      }
      case 'pending': {
        await this.projectsService.getProjectsByStatusAndCurator(30, this.curatorId, this.perPage, ev.newPage)
          .then(res => {
            if (res.data) {
              this.pendingProjects = res.data;
              this.totalPages.pending = res.pages;
              this.currentPage.pending = res.page;
            }
          }).catch(e => {
            console.error(e);
            this.snackBar.open(`Не удалось загрузить проекты: ${e.error.message}`, 'Закрыть', {duration: 5000});
          });
        break;
      }

      case 'archive': {
        await this.projectsService.getArchiveProjectsByCurator(this.curatorId, this.perPage, ev.newPage)
          .then(res => {
            if (res.data) {
              this.archiveProjects = res.data;
              this.totalPages.archive = res.pages;
              this.currentPage.archive = res.page;
            }
          }).catch(e => {
            console.error(e);
            this.snackBar.open(`Не удалось загрузить проекты: ${e.error.message}`, 'Закрыть', {duration: 5000});
          });
        break;
      }
      default:
        break;
    }
  }

}
