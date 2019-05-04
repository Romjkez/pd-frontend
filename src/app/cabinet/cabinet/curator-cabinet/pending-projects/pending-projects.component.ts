import {Component, OnInit} from '@angular/core';
import {Project} from '../../../../modules/shared/models/project.model';
import {ProjectsService} from '../../../../modules/shared/services/projects.service';
import {AuthService} from '../../../../modules/shared/services/auth.service';
import {parseJwt} from '../../../../modules/shared/utils/functions.util';

@Component({
  selector: 'app-pending-projects',
  templateUrl: './pending-projects.component.html',
  styleUrls: ['./pending-projects.component.css']
})
export class PendingProjectsComponent implements OnInit {
  projects: Project[] | null;
  loading: boolean;
  currentPage = 1;
  totalPages: number;
  perPage = 5;
  statusFilter = 30;

  constructor(private authService: AuthService, private projectsService: ProjectsService) {
  }

  async ngOnInit() {
    this.loading = true;
    const curator = parseJwt(this.authService.getToken()).data.id;
    await this.projectsService.getProjectsByStatusAndCurator(this.statusFilter, curator, this.perPage, this.currentPage)
      .then((res) => {
        this.currentPage = res.page;
        this.totalPages = res.pages;
        this.perPage = res.per_page;
        this.projects = res.data;
      }).catch(e => {
        console.error('Failed to get pending projects:', e);
      }).finally(() => this.loading = false);
  }

  async switchPage(newPage: number) {
    const curator = parseJwt(this.authService.getToken()).data.id;
    await this.projectsService.getProjectsByStatusAndCurator(this.statusFilter, curator, this.perPage, newPage).then((res) => {
      this.currentPage = res.page;
      this.totalPages = res.pages;
      this.perPage = res.per_page;
      this.projects = res.data;
    }).catch(e => {
      console.error('Failed to get pending projects:', e);
    });
  }

}
