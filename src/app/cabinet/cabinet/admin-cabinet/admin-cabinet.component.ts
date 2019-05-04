import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ProjectsService} from '../../../modules/shared/services/projects.service';
import {TagsService} from '../../../modules/shared/services/tags.service';
import {AuthService} from '../../../modules/shared/services/auth.service';
import {Tag} from '../../../modules/shared/models/tags.model';
import {ListItem} from '../../../modules/shared/components/editable-list/editable-list.component';
import {Projects} from '../../../modules/shared/models/project.model';

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

  constructor(private projectsService: ProjectsService, private snackBar: MatSnackBar, private matDialog: MatDialog,
              private authService: AuthService, private tagsService: TagsService) {
  }

  async ngOnInit() {
    this.loading = true;
    await this.projectsService.getProjectsByStatus(this.statusFilter, this.perPage, this.currentPage)
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
    await this.projectsService.getProjectsByStatus(this.statusFilter, this.perPage, newPage).then((res) => {
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
    await this.tagsService.getTags().then(res => {
      this.tags = res;
      this.matDialog.open(this.tagsModal, {width: '90%', maxWidth: '1000px'});
    }).catch(e => {
      this.snackBar.open(`Не удалось открыть список тегов: ${e.error.message}`, 'Закрыть', {duration: 5000});
      this.authService.logout();
      console.error(e);
    });
  }

  async onEditTag(tag: Tag | ListItem) {
    this.tagsService.editTag(<Tag>tag).then(res => {
      if (res.message === 'true') {
        this.snackBar.open('Тег отредактирован', 'Закрыть', {duration: 2500});
      } else {
        this.snackBar.open(`Ошибка при редактировании: ${res}`, 'Закрыть');
      }
    }).catch(e => {
      this.snackBar.open(`Ошибка при редактировании: ${e.error.message}`, 'Закрыть');
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
        this.snackBar.open(`Ошибка при добавлении: ${res}`, 'Закрыть');
      }
    }).catch(e => {
      this.snackBar.open(`Ошибка при добавлении: ${e.error.message}`, 'Закрыть');
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
        this.snackBar.open(`Ошибка при удалении: ${res}`, 'Закрыть');
      }
    }).catch(e => {
      this.snackBar.open(`Ошибка при удалении: ${e.error.message}`, 'Закрыть');
      console.error(e);
      if (e.status === 401) {
        this.authService.logout();
      }
    });
  }
}
