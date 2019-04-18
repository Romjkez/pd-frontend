import {Component, Input, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {ApiService} from '../../services/api.service';
import {filter, tap} from 'rxjs/operators';
import {Router} from '@angular/router';

enum SearchTarget {
  project = 'project',
  user = 'user'
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchValue: FormControl;
  results = [];
  @Input() target: string = SearchTarget.project; // search project by default

  constructor(private apiService: ApiService, public router: Router) {
  }

  ngOnInit() {
    this.searchValue = new FormControl('',
      [Validators.minLength(3), Validators.maxLength(99)]);
  }

  onSearch(event: Event) {
    if (event.isTrusted) {
      if (this.target === 'project') {
        if (this.searchValue.value.toString().length > 2 && this.searchValue.value.toString().length < 100) {
          this.apiService.searchProjectByTitle(this.searchValue.value).pipe(
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
