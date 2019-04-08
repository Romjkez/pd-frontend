import {Component, Input, OnInit} from '@angular/core';
import {Project} from '../../models/project.model';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  @Input() projects: Project[];
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
