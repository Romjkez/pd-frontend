import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../shared/services/api.service';
import {Project} from '../../shared/models/project.model';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  projects: Project[] | null;
  currentPage = 1;
  totalPages: number;
  perPage = 5;
  statusFilter = 1;
  loading: boolean;
  searchResult: Project[];

  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {
  }

  async ngOnInit() {
    this.loading = true;
    await this.apiService.getProjectsByStatus(this.statusFilter, this.perPage, this.currentPage).then((res) => {
      this.currentPage = res.page;
      this.totalPages = res.pages;
      this.perPage = res.per_page;
      this.projects = res.data;
    }).catch(e => {
      this.snackBar.open('Не удалось загрузить проекты', 'Закрыть');
      console.error('Failed to get projects:', e);
    }).finally(() => this.loading = false
    );
    this.apiService.updateProjectsDeadlines().then((res) => {
      if (res.body.message === 'true') {
      } else {
        console.log('Failed to update projects actuality: ', res.body.message);
      }
    }).catch(e => console.error(e));
  }

  async switchPage(newPage: number) {
    await this.apiService.getProjectsByStatus(this.statusFilter, this.perPage, newPage).then((res) => {
      this.currentPage = res.page;
      this.totalPages = res.pages;
      this.perPage = res.per_page;
      this.projects = res.data;
    }).catch(e => {
      this.snackBar.open('Не удалось загрузить проекты', 'Закрыть');
      console.error('Failed to get projects:', e);
    });
  }
}
