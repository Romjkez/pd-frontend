import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../shared/services/api.service';
import {Project} from '../../shared/models/project.model';
import {MatSnackBar} from '@angular/material';
import {Tag} from '../../shared/models/tags.model';
import {NgModel} from '@angular/forms';

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

  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {
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
        // this.selectAllTags();
      } else {
        this.snackBar.open(`Не удалось загрузить теги:\n ${(<any>tagsResponse).message}`, 'Закрыть', {duration: 5000});
      }
    }).catch(e => {
      console.error(e);
    })
      .finally(() => this.loading = false);
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

  selectAllTags(select: NgModel, tags: Tag[]): void {
    select.update.emit(tags);
    console.log(this.selectedTags);
  }

  compareFn(x: Tag, y: Tag): boolean {
    return x && y ? x.value === y.value : x === y;
  }

  deselectAllTags(select: NgModel): void {
    select.update.emit();
    this.selectedTags = [];
    console.log(this.selectedTags);
  }
}
