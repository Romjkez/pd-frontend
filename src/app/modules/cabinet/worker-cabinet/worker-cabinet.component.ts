import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {ProjectsService} from '../../shared/services/projects.service';
import {Applications} from '../../shared/models/application.model';
import {AuthService} from '../../shared/services/auth.service';
import {UserProjects} from '../../shared/models/project.model';
import {ApplicationsService} from '../../shared/services/applications.service';

@Component({
  selector: 'app-worker-cabinet',
  templateUrl: './worker-cabinet.component.html',
  styleUrls: ['./worker-cabinet.component.css']
})
export class WorkerCabinetComponent implements OnInit {
  projects: UserProjects;
  per_page = 5;
  page = 1;
  apps: Applications;
  loading: boolean;

  constructor(private applicationsService: ApplicationsService, private projectsService: ProjectsService,
              private authService: AuthService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.loading = true;
    Promise.all([
      this.projectsService.getUserProjects(this.authService.getUserId()),
      this.applicationsService.getUserApps(this.authService.getUserId(), this.per_page, this.page)
    ])
      .then(([projects, apps]) => {
        this.projects = projects;
        this.apps = apps;
      })
      .catch(e => {
        this.snackBar.open(`Ошибка загрузки: ${e.error.message}`, 'Закрыть', {duration: 5000});
        console.error(e);
      })
      .finally(() => this.loading = false);
  }

  async switchPage(newPage: number) {
    this.loading = true;
    await this.applicationsService.getUserApps(this.authService.getUserId(), this.per_page, newPage).then(res => {
      this.page = res.page;
      this.projects = res.data;
    }).catch(e => {
      this.snackBar.open(`Не удалось загрузить проекты: ${e.error.message}`, 'Закрыть', {duration: 5000});
      console.error(e);
    }).finally(() => this.loading = false);
  }
}
