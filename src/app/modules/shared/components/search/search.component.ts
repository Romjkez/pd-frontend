import {Component, Input, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {ProjectsService} from '../../services/projects.service';
import {filter, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {colorMap, statusMap} from '../project-snippet/project-snippet.component';

enum SearchTarget {
  project = 'project',
  user = 'user'
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchValue: FormControl;
  results = [];
  colorMap = colorMap;
  statusMap = statusMap;
  loading: boolean;
  @Input() target: string = SearchTarget.project; // search project by default

  constructor(private projectsService: ProjectsService, public router: Router) {
  }

  ngOnInit(): void {
    this.searchValue = new FormControl('',
      [Validators.minLength(3), Validators.maxLength(99)]);
  }

  onSearch(event: Event) {
    this.loading = true;
    if (event.isTrusted) {
      if (this.target === 'project') {
        if (this.searchValue.value.toString().length > 2 && this.searchValue.value.toString().length < 100) {
          this.projectsService.searchProjectByTitle(this.searchValue.value).pipe(
            filter(result => result.length && result.length > 0),
            tap(result => this.results = result),
          ).subscribe();
        } else {
          this.results = [];
        }
      } else {
        // search users
      }
    }
  }
}
