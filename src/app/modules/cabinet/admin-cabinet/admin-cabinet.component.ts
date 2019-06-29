import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ProjectsService} from '../../shared/services/projects.service';
import {TagsService} from '../../shared/services/tags.service';
import {AuthService} from '../../shared/services/auth.service';
import {Tag} from '../../shared/models/tags.model';
import {ListItem} from '../../shared/components/editable-list/editable-list.component';
import {Projects} from '../../shared/models/project.model';

@Component({
  selector: 'app-admin-cabinet',
  templateUrl: './admin-cabinet.component.html',
  styleUrls: ['./admin-cabinet.component.scss']
})
export class AdminCabinetComponent implements OnInit {
  projects: Projects;
  perPage = 5;
  currentPage = 1;
  totalPages: number;
  statusFilter = 0;
  loading: boolean;
  tags: Tag[];
  @ViewChild('tagsModal', {static: false}) tagsModal: TemplateRef<any>;

  constructor(private projectsService: ProjectsService, public snackBar: MatSnackBar, private matDialog: MatDialog,
              private authService: AuthService, private tagsService: TagsService) {
  }

  async ngOnInit() {
    this.loading = true;
    await this.projectsService.getProjectsByStatus(this.statusFilter, this.perPage, this.currentPage)
      .then((res) => {
        this.currentPage = res.page;
        this.totalPages = res.pages;
        this.projects = res;
      }).catch(e => {
        this.snackBar.open(`Не удалось загрузить проекты: ${e.error.message || 'отсутствует соединение с интернетом'}`,
          'Закрыть');
        console.error(e);
      }).finally(() => this.loading = false);
  }

  async switchPage(newPage: number) {
    this.loading = true;
    await this.projectsService.getProjectsByStatus(this.statusFilter, this.perPage, newPage).then((res) => {
      this.currentPage = res.page;
      this.totalPages = res.pages;
      this.projects = res;
    }).catch(e => {
      this.snackBar.open(`Не удалось загрузить проекты: ${e.error.message || 'отсутствует соединение с интернетом'}`,
        'Закрыть', {duration: 4000});
      console.error(e);
    }).finally(() => this.loading = false);
  }

  async openTagsDialog() {
    await this.tagsService.getTags().then(res => {
      this.tags = res;
      this.matDialog.open(this.tagsModal, {width: '90%', maxWidth: '1000px'});
    }).catch(e => {
      this.snackBar.open(`Не удалось открыть список тегов: ${e.error.message || 'отсутствует соединение с интернетом'}`,
        'Закрыть', {duration: 5000});
      if (e.status === 401) {
        this.authService.logout();
      }
      console.error(e);
    });
  }

  async onEditTag(tag: Tag | ListItem) {
    this.tagsService.editTag(<Tag>tag).then(res => {
      if (res.message === 'true') {
        this.snackBar.open('Тег отредактирован', 'Закрыть', {duration: 2500});
      } else {
        this.snackBar.open(`Ошибка при редактировании: ${res.message}`, 'Закрыть');
      }
    }).catch(e => {
      this.snackBar.open(`Ошибка при редактировании: ${e.error.message || 'отсутствует соединение с интернетом'}`,
        'Закрыть');
      console.error(e);
      if (e.status === 401) {
        this.authService.logout();
      }
    });
  }

  async onAddTag(tag: Tag | ListItem) {
    this.tagsService.addTag(<Tag>tag).then(res => {
      if (res.id) {
        this.tagsService.getTags().then(result => {
          this.tags = result;
          this.snackBar.open(`Тег "${res.value}" добавлен`, 'Закрыть', {duration: 3000});
        }).catch(e => console.error(e));
      } else {
        this.snackBar.open(`Ошибка при добавлении: ${(<any>res).message}`, 'Закрыть');
      }
    }).catch(e => {
      this.snackBar.open(`Ошибка при добавлении: ${e.error.message || 'отсутствует соединение с интернетом'}`, 'Закрыть');
      console.error(e);
      if (e.status === 401) {
        this.authService.logout();
      }
    });
  }

  async onDeleteTag(tag: Tag | ListItem) {
    this.tagsService.deleteTag(tag.id).then(res => {
      if (res.message === 'true') {
        this.snackBar.open(`Тег "${tag.value}" удалён`, 'Закрыть', {duration: 3500});
      } else {
        this.snackBar.open(`Ошибка при удалении: ${res.message}`, 'Закрыть');
      }
    }).catch(e => {
      this.snackBar.open(`Ошибка при удалении: ${e.error.message || 'отсутствует соединение с интернетом'}`, 'Закрыть');
      console.error(e);
      if (e.status === 401) {
        this.authService.logout();
      }
    });
  }
}
