import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../shared/services/api.service';
import {AuthService} from '../../../shared/services/auth.service';
import {UserProjects} from '../../../user-view/user-view.component';
import {ParsedProjectApplication} from '../../../project/project/project.component';

export interface Applications {
  per_page: number;
  page: number;
  pages: number;
  data: ParsedProjectApplication[];
}

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

  constructor(private apiService: ApiService, private authService: AuthService) {
  }

  ngOnInit() {
    this.loading = true;
    Promise.all([
      this.apiService.getUserProjects(this.authService.getUserId()),
      this.apiService.getUserApps(this.authService.getUserId(), this.per_page, this.page)
    ])
      .then(([projects, apps]) => {
        this.projects = projects;
        this.apps = apps;
      })
      .catch(e => console.error(e))
      .finally(() => this.loading = false);
  }

  async switchPage(newPage: number) {
    await this.apiService.getUserApps(this.authService.getUserId(), this.per_page, newPage).then((res) => {
      this.page = res.page;
      this.per_page = res.per_page;
      this.projects = res.data;
    }).catch(e => {
      console.error('Failed to get active projects:', e);
    });
  }
}
