import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';

export interface Project {
  id: number;
  title: string;
  description: string;
  members: object;
  deadline: string;
  curator: number | string;
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
  status: string;

  statusMap: Map<string, string> = new Map([
    ['0', 'На рассмотрении'],
    ['1', 'Открыт'],
    ['2', 'Закрыт'],
    ['3', 'Не прошёл модерацию']
  ]);

  constructor(private apiService: ApiService) {
  }

  async ngOnInit() {
    this.tags = this.project.tags.split(',');
    await this.apiService.getUserById(<string>this.project.curator).then((res) => {
      this.curatorName = res.name;
      this.curatorSurname = res.surname;
    }).catch(e => {
      console.error('Failed to get curator name&surname:', e);
    });
  }

}
