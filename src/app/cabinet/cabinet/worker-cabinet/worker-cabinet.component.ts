import {Component, OnInit} from '@angular/core';
import {Applications} from '../../../modules/shared/models/application.model';
import {ProjectsService} from '../../../modules/shared/services/projects.service';
import {AuthService} from '../../../modules/shared/services/auth.service';
import {UserProjects} from '../../../modules/shared/models/project.model';
import {ApplicationsService} from '../../../modules/shared/services/applications.service';

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

  constructor(private applicationsService: ApplicationsService, private projectsService: ProjectsService, private authService: AuthService) {
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
      .catch(e => console.error(e))
      .finally(() => this.loading = false);
  }

  async switchPage(newPage: number) {
    await this.applicationsService.getUserApps(this.authService.getUserId(), this.per_page, newPage).then((res) => {
      this.page = res.page;
      this.per_page = res.per_page;
      this.projects = res.data;
    }).catch(e => {
      console.error('Failed to get active projects:', e);
    });
  }
}
