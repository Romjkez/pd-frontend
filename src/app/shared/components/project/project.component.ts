import {Component, OnInit} from '@angular/core';
import {colorMap, Project, statusMap} from '../project-snippet/project-snippet.component';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  project: Project;
  colorMap = colorMap;
  statusMap = statusMap;
  tags: string[];
  curatorName: string;
  curatorSurname: string;
  curatorMiddlename: string;
  fullness: object;


  constructor(private activatedRoute: ActivatedRoute, private apiService: ApiService) {
  }

  async ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    await this.apiService.getProjectById(id).then((res: Project) => {
      this.project = res;
    }).then(() => {
      this.apiService.getUserById(this.project.curator).then((res) => {
        this.fullness = this.getOccupiedQuantity(this.project.members);
        this.curatorName = res.name;
        this.curatorSurname = res.surname;
        this.curatorMiddlename = res.middle_name;
        this.tags = this.project.tags.split(',');
        this.project.deadline = this.project.deadline.split('-').reverse().join('-');
      }).catch(e => console.log(e));
    });
  }

  getOccupiedQuantity(members: string): object {
    const membersArray: object[] = JSON.parse(this.project.members);
    let occupied = 0;
    let places = 0;
    for (let i = 0; i < membersArray.length; i++) {
      for (const key in membersArray[i]) {
        if (membersArray[i][key] !== 0) {
          occupied++;
        }
        places++;
      }
    }
    return {
      'occupied': occupied,
      'places': places
    };
  }
}
