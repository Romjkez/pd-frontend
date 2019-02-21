import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';

export interface Project {
  id: number;
  title: string;
  description: string;
  members: string;
  deadline: string;
  curator: number;
  tags: string;
  status: number;
  adm_comment: string | null;
}

@Component({
  selector: 'app-project-snippet',
  templateUrl: './project-snippet.component.html',
  styleUrls: ['./project-snippet.component.css']
})
export class ProjectSnippetComponent implements OnInit {
  @Input() project: Project;
  tags: string[];
  curatorName: string;
  curatorSurname: string;
  statusMap: Map<string, string> = new Map([
    ['0', 'На рассмотрении'],
    ['1', 'Открыт'],
    ['2', 'Закрыт'],
    ['3', 'Не прошёл модерацию']
  ]);
  fullness: number[];

  constructor(private apiService: ApiService) {
  }

  async ngOnInit() {
    this.fullness = this.getOccupiedQuantity(this.project.members);
    this.tags = this.project.tags.split(',');
    await this.apiService.getUserById(this.project.curator).then((res) => {
      this.curatorName = res.name;
      this.curatorSurname = res.surname;
    }).catch(e => {
      console.error('Failed to get curator name&surname:', e);
    });
  }

  getOccupiedQuantity(members: string): number[] {
    const membersArray: object[] = JSON.parse(this.project.members);
    let occupied = 0;
    let places = 0;
    for (let i = 0; i < membersArray.length; i++) {
      for (let key in membersArray[i]) {
        if (membersArray[i][key] !== 0) {
          occupied++;
        }
        places++;
      }
    }
    return [occupied, places];
  }
}
