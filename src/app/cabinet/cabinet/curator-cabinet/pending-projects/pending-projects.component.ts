import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../shared/services/auth.service';
import {ApiService} from '../../../../shared/services/api.service';
import {parseJwt} from '../../../../shared/utils/functions.util';
import {Project} from '../../../../shared/models/project.model';

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

  constructor(private authService: AuthService, private apiService: ApiService) {
  }

  async ngOnInit() {
    this.loading = true;
    const curator = parseJwt(this.authService.getToken()).data.email;
    await this.apiService.getProjectsByStatusAndCurator(this.statusFilter, curator, this.perPage, this.currentPage)
      .then((res) => {
        this.currentPage = res.page;
        this.totalPages = res.pages;
        this.perPage = res.per_page;
        this.projects = res.data;
        this.loading = false;
      }).catch(e => {
        this.loading = false;
        console.error('Failed to get pending projects:', e);
      });
  }

  async switchPage(newPage: number) {
    await this.apiService.getProjectsByStatus(this.statusFilter, this.perPage, newPage).then((res) => {
      this.currentPage = res.page;
      this.totalPages = res.pages;
      this.perPage = res.per_page;
      this.projects = res.data;
    }).catch(e => {
      console.error('Failed to get pending projects:', e);
    });
  }

}
