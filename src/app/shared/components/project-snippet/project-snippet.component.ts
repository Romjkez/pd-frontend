import {Component, Input, OnInit} from '@angular/core';
import {ApiService, User} from '../../services/api.service';
import {Router} from '@angular/router';

export interface ProjectDocument {
  title: string;
  link: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  members: User[];
  deadline: string;
  finish_date: string;
  curator: User;
  tags: string;
  status: string;
  adm_comment: string | null;
  files: ProjectDocument[];
}

export const statusMap: Map<string, string> = new Map([
  ['0', 'На рассмотрении'],
  ['1', 'Выполняется'],
  ['2', 'Завершён'],
  ['3', 'Не прошёл модерацию']
]);
export const colorMap: Map<string, string> = new Map([
  ['0', '#000'],
  ['1', '#08bc00'],
  ['2', '#ec4545'],
  ['3', '#e3a100']
]);

@Component({
  selector: 'app-project-snippet',
  templateUrl: './project-snippet.component.html',
  styleUrls: ['./project-snippet.component.css']
})
export class ProjectSnippetComponent implements OnInit {
  @Input() project: Project;
  tags: string[];
  fullness: number[];
  statusMap = statusMap;
  colorMap = colorMap;

  constructor(private apiService: ApiService, private router: Router) {
  }

  async ngOnInit() {
    this.fullness = this.getOccupiedQuantity(this.project.members);
    this.tags = this.project.tags.split(',');
  }

  getOccupiedQuantity(members: User[]): number[] {
    if (typeof members === 'string') {
      members = JSON.parse(members);
    }
    let occupied = 0;
    let places = 0;
    for (let i = 0; i < members.length; i++) {
      for (const key in members[i]) {
        if (members[i][key] !== 0) {
          occupied++;
        }
        places++;
      }
    }
    return [occupied, places];
  }
}
