import {Component, OnInit} from '@angular/core';
import {AuthService, parseJwt} from '../../../../shared/services/auth.service';
import {ApiService} from '../../../../shared/services/api.service';

@Component({
  selector: 'app-archive-projects',
  templateUrl: './archive-projects.component.html',
  styleUrls: ['./archive-projects.component.css']
})
export class ArchiveProjectsComponent implements OnInit {
  projects: [] | null;
  loading: boolean;
  currentPage = 1;
  totalPages: number;
  perPage = 5;
  curator: number;

  constructor(private authService: AuthService, private apiService: ApiService) {
  }

  async ngOnInit() {
    this.loading = true;
    this.curator = parseJwt(this.authService.getToken()).data.id;
    await this.apiService.getArchiveProjectsByCurator(this.curator, this.perPage, this.currentPage)
      .then((res) => {
        this.currentPage = res.page;
        this.totalPages = res.pages;
        this.perPage = res.per_page;
        this.projects = res.data;
        this.loading = false;
      }).catch(e => {
        this.loading = false;
        console.error('Failed to get archive projects:', e);
      });
  }

  async switchPage(newPage: number) {
    await this.apiService.getArchiveProjectsByCurator(this.curator, this.perPage, newPage).then((res) => {
      this.currentPage = res.page;
      this.totalPages = res.pages;
      this.perPage = res.per_page;
      this.projects = res.data;
    }).catch(e => {
      console.error('Failed to get archive projects:', e);
    });
  }

}
