import {Component, Input, OnInit} from '@angular/core';
import {Projects} from '../../services/api.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  @Input() projects: Projects[];
  perPage = 5;
  currentPage = 1;
  totalPages: number;

  constructor() {
  }

  ngOnInit() {
  }

  switchPage(newPage: number) {
  }
}
