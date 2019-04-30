import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../shared/services/api.service';
import {Project} from '../../shared/models/project.model';
import {MatSnackBar} from '@angular/material';
import {Tag} from '../../shared/models/tags.model';
import {NgModel} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

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

  constructor(private apiService: ApiService, private snackBar: MatSnackBar, private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  async ngOnInit() {
    this.loading = true;
    Promise.all([
      this.apiService.getProjectsByStatus(this.statusFilter, this.perPage, this.currentPage),
      this.apiService.updateProjectsDeadlines(),
      this.apiService.getTags()
    ]).then(([projectsResponse, updateResponse, tagsResponse]) => {
      if (projectsResponse.data && projectsResponse.page) {
        this.currentPage = projectsResponse.page;
        this.totalPages = projectsResponse.pages;
        this.perPage = projectsResponse.per_page;
        this.projects = projectsResponse.data;
      } else {
        this.snackBar.open(`Не удалось загрузить проекты:\n ${(<any>projectsResponse).message}`, 'Закрыть', {duration: 6000});
      }
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
      if (params.tags) {
        this.apiService.getProjectsByTags(params.tags, newPage, this.perPage, this.statusFilter).then((res) => {
          this.projects = res.data || [];
          this.currentPage = res.page;
          this.totalPages = res.pages;
        }).catch((e) => {
          this.snackBar.open('Не удалось применить фильтр', 'Закрыть', {duration: 5000});
          console.error(e);
        }).finally(() => this.loading = false);
      } else {
        this.apiService.getProjectsByStatus(this.statusFilter, this.perPage, newPage).then((res) => {
          this.currentPage = res.page;
          this.totalPages = res.pages;
          this.projects = res.data;
        }).catch(e => {
          this.snackBar.open('Не удалось загрузить проекты', 'Закрыть');
          console.error('Failed to get projects:', e);
        });
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

  async onTagsFilterChange(newValue: Tag[], newPage?: number) {
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
        this.snackBar.open('Не удалось применить фильтр', 'Закрыть', {duration: 5000});
        console.error(e);
      }).finally(() => this.loading = false);
      this.router.navigate(['/'], {queryParams: newValue.length === this.tags.length ? {tags: 'all'} : searchTags});
    } else {
      this.router.navigate(['/']);
    }
  }
}
