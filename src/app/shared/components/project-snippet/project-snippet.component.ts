import {Component, Input, OnInit} from '@angular/core';
import {Project} from '../../models/project.model';
import {User} from '../../models/user.model';


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
  ['3', '#b16300']
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

  constructor() {
  }

  async ngOnInit() {
    this.fullness = this.getOccupiedQuantity(this.project.members);
    this.tags = this.project.tags.split(',');
    this.project.avatar = this.project.avatar || '../assets/img/snippet_default_bg.jpg';
  }

  getOccupiedQuantity(members: User[]): number[] {
    if (typeof members === 'string') {
      members = JSON.parse(members);
    }
    let occupied = 0;
    let places = 0;
    for (let i = 0; i < members.length; i++) {
      // tslint:disable-next-line
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
