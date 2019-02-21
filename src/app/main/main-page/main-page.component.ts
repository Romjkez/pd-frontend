import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../shared/services/api.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  projects: [] | null;
  currentPage: number;
  totalPages: number;
  perPage: number;

  constructor(private apiService: ApiService) {
  }

  async ngOnInit() {
    await this.apiService.getProjectsByStatus(1).then((res) => {
      this.currentPage = res.page;
      this.totalPages = res.pages;
      this.perPage = res.per_page;
      this.projects = res.data;
    }).catch(e => {
      console.error('Failed to get projects:', e);
    });
  }

}
