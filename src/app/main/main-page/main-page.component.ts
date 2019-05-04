import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../shared/services/api.service';
import {Project} from '../../shared/models/project.model';
import {MatSlideToggleChange, MatSnackBar} from '@angular/material';
import {Tag} from '../../shared/models/tags.model';
import {NgModel} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TagsService} from '../../shared/services/tags.service';

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
  tags: Tag[];
  selectedTags: string[] = [];
  sortOptions = '-id';

  constructor(private apiService: ApiService, private snackBar: MatSnackBar, private router: Router,
              private activatedRoute: ActivatedRoute, private tagsService: TagsService) {
  }

  async ngOnInit() {
    this.loading = true;
    this.switchPage(1);
    Promise.all([
      this.apiService.updateProjectsDeadlines(),
      this.tagsService.getTags()
    ]).then(([updateResponse, tagsResponse]) => {
      if (updateResponse.message !== 'true') {
        this.snackBar.open(`Не удалось обновить проекты:\n ${(<any>updateResponse).message}`, 'Закрыть', {duration: 5000});
      }
      if (tagsResponse.length && tagsResponse.length > 0) {
        this.tags = tagsResponse;
      } else {
        this.snackBar.open(`Не удалось загрузить теги:\n ${(<any>tagsResponse).message}`, 'Закрыть', {duration: 5000});
      }
    }).catch(e => {
      console.error(e);
    })
      .finally(() => this.loading = false);
  }

  switchPage(newPage: number) {
    this.activatedRoute.queryParams.pipe().subscribe(params => {
      this.loading = true;
      if (params.tags) {
        this.resetSorts();
        this.apiService.getProjectsByTags(params.tags, newPage, this.perPage, this.statusFilter).then((res) => {
          this.projects = res.data || [];
          this.currentPage = res.page;
          this.totalPages = res.pages;
        }).catch(e => {
          this.snackBar.open(`Не удалось применить фильтр: ${e}`, 'Закрыть', {duration: 5000});
          console.error(e);
        }).finally(() => this.loading = false);
      } else if (params.sort) {
        this.sortOptions = params.sort;
        this.apiService.getProjectsByStatus(this.statusFilter, this.perPage, newPage, this.sortOptions).then(res => {
          this.projects = res.data || [];
          this.totalPages = res.pages;
          this.currentPage = res.page;
        }).catch(e => {
          this.snackBar.open('Не удалось отсортировать проекты', 'Закрыть', {duration: 5000});
          console.error(e);
        }).finally(() => this.loading = false);
      } else {
        this.sortOptions = '-id';
        this.apiService.getProjectsByStatus(this.statusFilter, this.perPage, newPage).then((res) => {
          this.currentPage = res.page;
          this.totalPages = res.pages;
          this.projects = res.data || [];
        }).catch(e => {
          this.snackBar.open('Не удалось загрузить проекты', 'Закрыть', {duration: 5000});
          console.error(e);
        }).finally(() => this.loading = false);
      }
    });
  }

  selectAllTags(select: NgModel, tags: Tag[]): void {
    select.update.emit(tags);
  }

  compareFn(x: Tag, y: Tag): boolean {
    return x && y ? x.value === y.value : x === y;
  }

  deselectAllTags(select: NgModel): void {
    select.update.emit();
    this.selectedTags = [];
  }

  async onTagsFilterChange(newValue: Tag[]) {
    this.sortOptions = ''; // todo DELETE when multiple sort&filters will be available

    if (newValue && newValue.length !== 0) {
      this.loading = true;
      this.projects.length = 0;
      const searchTags = {tags: ''};
      newValue.forEach(itm => {
        Object.keys(itm).forEach(key =>
          key === 'value' ? searchTags.tags = searchTags.tags.concat(`${encodeURIComponent(itm[key])},`) : false);
      });
      await this.apiService.getProjectsByTags(searchTags.tags, this.currentPage, this.perPage, this.statusFilter).then((res) => {
        this.projects = res.data || [];
        this.totalPages = res.pages;
        this.currentPage = res.page;
      }).catch((e) => {
        this.snackBar.open(`Не удалось применить фильтр: ${e}`, 'Закрыть', {duration: 5000});
        console.error(e);
      }).finally(() => this.loading = false);
      this.router.navigate(['/'], {queryParams: newValue.length === this.tags.length ? {tags: 'all'} : searchTags});
    } else {
      this.router.navigate(['/']);
    }
  }

  onSortOptionsChange(ev: MatSlideToggleChange): void {
    this.selectedTags = [];

    if (ev.source.id === 'deadlineSort') {
      if (ev.checked) {
        this.sortOptions = '-deadline';
        document.getElementById('finishDateSort').classList.remove('mat-checked');
        document.getElementById('idSort').classList.remove('mat-checked');
      } else {
        this.sortOptions = 'deadline';
      }
    } else if (ev.source.id === 'finishDateSort') {
      if (ev.checked) {
        this.sortOptions = '-finish_date';
        document.getElementById('deadlineSort').classList.remove('mat-checked');
        document.getElementById('idSort').classList.remove('mat-checked');

      } else {
        this.sortOptions = 'finish_date';
      }
    } else {
      if (ev.checked) {
        this.sortOptions = '-id';
        document.getElementById('deadlineSort').classList.remove('mat-checked');
        document.getElementById('finishDateSort').classList.remove('mat-checked');
      } else {
        this.sortOptions = 'id';
      }
    }
    this.apiService.getProjectsByStatus(this.statusFilter, this.perPage, 1, this.sortOptions)
      .then(res => {
        this.projects = res.data;
        this.currentPage = res.page;
        this.totalPages = res.pages;
        this.router.navigate(['/'], {queryParams: {sort: this.sortOptions}});
      })
      .catch(e => {
        console.log(e);
        this.snackBar.open(`Не удалось отсортировать проекты: ${e}`, 'Закрыть', {duration: 5000});
      })
      .finally(() => this.loading = false);
  }

  resetSorts(): void {
    this.sortOptions = '';
    document.getElementById('finishDateSort').classList.remove('mat-checked');
    document.getElementById('deadlineSort').classList.remove('mat-checked');
  }
}
