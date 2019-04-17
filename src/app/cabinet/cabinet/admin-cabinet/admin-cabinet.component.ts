import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ApiService} from '../../../shared/services/api.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Projects} from '../../../shared/models/project.model';
import {Tag} from '../../../shared/models/tags.model';
import {ListItem} from '../../../shared/components/editable-list/editable-list.component';
import {AuthService} from '../../../shared/services/auth.service';

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
  tags: Tag[];
  @ViewChild('tagsModal') tagsModal: TemplateRef<any>;

  constructor(private apiService: ApiService, private snackBar: MatSnackBar, private matDialog: MatDialog,
              private authService: AuthService) {
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
      this.matDialog.open(this.tagsModal, {width: '90%', maxWidth: '1000px'});
    }).catch(e => {
      this.snackBar.open(`Не удалось открыть список тегов: ${e.error.message}`, 'Закрыть', {duration: 5000});
      this.authService.logout();
      console.error(e);
    });
  }

  async onEditTag(tag: Tag | ListItem) {
    this.apiService.editTag(<Tag>tag).then(res => {
      if (res.message === 'true') {
        this.snackBar.open('Тег отредактирован', 'Закрыть', {duration: 2500});
      } else {
        this.snackBar.open(`Ошибка при редактировании: ${res}`, 'Закрыть');
      }
    }).catch(e => {
      this.snackBar.open(`Ошибка при редактировании: ${e}`, 'Закрыть');
      console.error(e);
    });
  }

  async onAddTag(tag: Tag | ListItem) {
    this.apiService.addTag(<Tag>tag).then(res => {
      if (res.id) {
        this.apiService.getTags().then(result => {
          this.tags = result;
          this.snackBar.open(`Тег "${res.value}" добавлен`, 'Закрыть', {duration: 3000});
        }).catch(e => console.error(e));
      } else {
        this.snackBar.open(`Ошибка при добавлении: ${res}`, 'Закрыть');
      }
    }).catch(e => {
      this.snackBar.open(`Ошибка при добавлении: ${e}`, 'Закрыть');
      console.error(e);
    });
  }

  async onDeleteTag(tag: Tag | ListItem) {
    this.apiService.deleteTag(tag.id).then(res => {
      if (res.message === 'true') {
        this.snackBar.open(`Тег "${tag.value}" удалён`, 'Закрыть', {duration: 3500});
      } else {
        this.snackBar.open(`Ошибка при удалении: ${res}`, 'Закрыть');
      }
    }).catch(e => {
      this.snackBar.open(`Ошибка при удалении: ${e}`, 'Закрыть');
      console.error(e);
    });
  }
}
