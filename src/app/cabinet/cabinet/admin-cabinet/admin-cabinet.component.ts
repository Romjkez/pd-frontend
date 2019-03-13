import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../shared/services/api.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-admin-cabinet',
  templateUrl: './admin-cabinet.component.html',
  styleUrls: ['./admin-cabinet.component.css']
})
export class AdminCabinetComponent implements OnInit {
  projects: any[];
  perPage = 5;
  currentPage = 1;
  totalPages: number;
  statusFilter = 0;
  loading: boolean;

  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {
  }

  async ngOnInit() {
    this.loading = true;
    await this.apiService.getProjectsByStatus(this.statusFilter, this.perPage, this.currentPage)
      .then((res) => {
        this.currentPage = res.page;
        this.totalPages = res.pages;
        this.perPage = res.per_page;
        this.projects = res.data;
        this.loading = false;
      }).catch(e => {
        this.loading = false;
        this.snackBar.open('Не удалось загрузить проекты', 'Закрыть', {duration: 4000});
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
      this.snackBar.open('Не удалось загрузить проекты', 'Закрыть', {duration: 4000});
      console.error('Failed to get pending projects:', e);
    });
  }

}
