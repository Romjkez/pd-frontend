import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ApiService} from '../../../shared/services/api.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Projects} from '../../../shared/models/project.model';
import {Tags} from '../../../shared/models/tags.model';

@Component({
  selector: 'app-admin-cabinet',
  templateUrl: './admin-cabinet.component.html',
  styleUrls: ['./admin-cabinet.component.css']
})
export class AdminCabinetComponent implements OnInit {
  projects: Projects;
  perPage = 5;
  currentPage = 1;
  totalPages: number;
  statusFilter = 0;
  loading: boolean;
  tags: Tags[];
  @ViewChild('tagsModal') tagsModal: TemplateRef<any>;

  constructor(private apiService: ApiService, private snackBar: MatSnackBar, private matDialog: MatDialog) {
  }

  async ngOnInit() {
    this.loading = true;
    await this.apiService.getProjectsByStatus(this.statusFilter, this.perPage, this.currentPage)
      .then((res) => {
        this.currentPage = res.page;
        this.totalPages = res.pages;
        this.perPage = res.per_page;
        this.projects = res;
      }).catch(e => {
        this.snackBar.open('Не удалось загрузить проекты', 'Закрыть');
        console.error('Failed to get pending projects:', e);
      }).finally(() => this.loading = false);
  }

  async switchPage(newPage: number) {
    await this.apiService.getProjectsByStatus(this.statusFilter, this.perPage, newPage).then((res) => {
      this.currentPage = res.page;
      this.totalPages = res.pages;
      this.perPage = res.per_page;
      this.projects = res;
    }).catch(e => {
      this.snackBar.open('Не удалось загрузить проекты', 'Закрыть', {duration: 4000});
      console.error('Failed to get pending projects:', e);
    });
  }

  async openTagsDialog() {
    await this.apiService.getTags().then(res => {
      this.tags = res;
      this.matDialog.open(this.tagsModal, {width: '60%', maxWidth: 1500});
    }).catch(e => {
      this.snackBar.open('Не удалось открыть список тегов', 'Закрыть');
      console.error(e);
    });
  }
}
