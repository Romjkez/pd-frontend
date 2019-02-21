import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../shared/services/api.service';
import {AuthService} from '../../../shared/services/auth.service';

@Component({
  selector: 'app-curator-cabinet',
  templateUrl: './curator-cabinet.component.html',
  styleUrls: ['./curator-cabinet.component.css']
})
export class CuratorCabinetComponent implements OnInit {
  projects: [] | null;
  loading: boolean;
  currentPage = 1;
  totalPages: number;
  perPage = 2;
  statusFilter = 1;

  constructor(private apiService: ApiService, private authService: AuthService) {
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
      }).catch(e => {
        this.loading = false;
        console.error('Failed to get projects:', e);
      });
  }

  async switchPage(newPage: number) {
    await this.apiService.getProjectsByStatus(this.statusFilter, this.perPage, newPage).then((res) => {
      this.currentPage = res.page;
      this.totalPages = res.pages;
      this.perPage = res.per_page;
      this.projects = res.data;
    }).catch(e => {
      console.error('Failed to get projects:', e);
    });
  }

}
