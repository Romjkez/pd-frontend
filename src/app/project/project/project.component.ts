import {Component, OnInit} from '@angular/core';
import {colorMap, Project, statusMap} from '../../shared/components/project-snippet/project-snippet.component';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../shared/services/api.service';
import {parseJwt} from '../../shared/services/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
})
export class ProjectComponent implements OnInit {
  project: Project;
  joinForm: FormGroup;
  colorMap = colorMap;
  statusMap = statusMap;
  tags: string[];
  curatorName: string;
  curatorSurname: string;
  curatorMiddlename: string;
  fullness = {
    'occupied': 0,
    'places': 0
  };
  usergroup: number;

  constructor(private activatedRoute: ActivatedRoute, private apiService: ApiService) {
  }

  async ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.joinForm = new FormGroup({
      role: new FormControl('', [Validators.required]),
      comment: new FormControl('', [Validators.maxLength(255)])
    });
    await this.apiService.getProjectById(id).then((res) => {
      this.project = res;
      this.project.members = JSON.parse(<string>this.project.members);
    }).then(() => {
      this.apiService.getUserById(this.project.curator).then((res) => {
        this.getOccupiedQuantity(<any>this.project.members).then((fullness) => {
          this.fullness = fullness;
        });
        this.curatorName = res.name;
        this.curatorSurname = res.surname;
        this.curatorMiddlename = res.middle_name;
        this.tags = this.project.tags.split(',');
        this.usergroup = parseJwt(localStorage.getItem('token')).data.usergroup;
      }).catch(e => console.log(e));
    });
  }

  async getOccupiedQuantity(members: object[]): Promise<{ occupied: number, places: number }> {
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
    return {
      'occupied': occupied,
      'places': places
    };
  }

  requestJoinProject() {
  }
}
