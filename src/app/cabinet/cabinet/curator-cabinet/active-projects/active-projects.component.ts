import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../shared/services/auth.service';
import {ApiService} from '../../../../shared/services/api.service';

@Component({
  selector: 'app-active-projects',
  templateUrl: './active-projects.component.html',
  styleUrls: ['./active-projects.component.css']
})
export class ActiveProjectsComponent implements OnInit {
  projects: [] | null;
  loading: boolean;
  currentPage = 1;
  totalPages: number;
  perPage = 2;
  statusFilter = 1;

  constructor(private authService: AuthService, private apiService: ApiService) {
  }

  async ngOnInit() {
    this.loading = true;
    const curator = this.authService.parseJwt(this.authService.getToken()).data.email;
    await this.apiService.getProjectsByStatusAndCurator(this.statusFilter, curator, this.perPage, this.currentPage)
      .then((res) => {
        this.currentPage = res.page;
        this.totalPages = res.pages;
        this.perPage = res.per_page;
        this.projects = res.data;
        this.loading = false;
        console.log(res);
      }).catch(e => {
        this.loading = false;
        console.error('Failed to get active projects:', e);
      });
  }

  async switchPage(newPage: number) {
    await this.apiService.getProjectsByStatus(this.statusFilter, this.perPage, newPage).then((res) => {
      this.currentPage = res.page;
      this.totalPages = res.pages;
      this.perPage = res.per_page;
      this.projects = res.data;
    }).catch(e => {
      console.error('Failed to get active projects:', e);
    });
  }
}
