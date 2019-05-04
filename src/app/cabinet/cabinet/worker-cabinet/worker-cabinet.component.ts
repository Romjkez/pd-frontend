import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../shared/services/api.service';
import {AuthService} from '../../../shared/services/auth.service';
import {UserProjects} from '../../../shared/models/project.model';
import {Applications} from '../../../shared/models/application.model';
import {ApplicationsService} from '../../../shared/services/applications.service';

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

  constructor(private applicationsService: ApplicationsService, private apiService: ApiService, private authService: AuthService) {
  }

  ngOnInit() {
    this.loading = true;
    Promise.all([
      this.apiService.getUserProjects(this.authService.getUserId()),
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
