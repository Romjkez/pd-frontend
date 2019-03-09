import {Component, OnInit} from '@angular/core';
import {colorMap, Project, statusMap} from '../../shared/components/project-snippet/project-snippet.component';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../shared/services/api.service';
import {parseJwt} from '../../shared/services/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatOptionSelectionChange, MatSnackBar} from '@angular/material';
import {HttpResponse} from '@angular/common/http';

export interface Application {
  id: number;
  worker_id: number;
  project_id: number;
  team: number;
  role: string;
  status: number;
  comment: string | null;
}

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
  joinRequested = false;
  usergroup: number;
  apps: Application[];

  constructor(private activatedRoute: ActivatedRoute, private apiService: ApiService, private snackBar: MatSnackBar) {
  }

  async ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.joinForm = new FormGroup({
      team: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      comment: new FormControl('', [Validators.maxLength(255)])
    });
    await this.apiService.getProjectById(id).then((res) => {
      this.project = res;
      this.project.members = JSON.parse(<string>this.project.members);
      this.getApps();
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
      });
    }).then(() => {
      this.apiService.isWorkerRequestedJoin(parseJwt(localStorage.getItem('token')).data.id, this.project.id).then(res => {
        if (res.body.message === 'true') {
          this.joinRequested = true;
        }
      });
    }).catch(e => console.error(e));
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

  changeSelection(event: MatOptionSelectionChange): void {
    if (event.isUserInput) {
      const team = event.source.value.team;
      const role = event.source.value.role;
      this.joinForm.patchValue({team, role});
    }
  }

  async requestJoinProject(): Promise<any> {
    const projectId = this.project.id;
    const workerId = parseJwt(localStorage.getItem('token')).data.id;
    const team = this.joinForm.controls.team.value;
    const role = this.joinForm.controls.role.value;
    const comment = this.joinForm.controls.comment.value;
    await this.apiService.createApp(workerId, projectId, team, role, comment).then((res: HttpResponse<any>) => {
      if (res.status === 201) {
        this.snackBar.open(`Заявка подана: ${role}, команда №${team + 1}`, '', {duration: 4000});
        this.joinRequested = true;
      }
    }).catch(e => {
      this.snackBar.open('Не удалось подать заявку. Возможно, кого-то уже взяли на эту позицию', 'Закрыть', {duration: 4000});
      console.error(e);
    });
  }

  async getApps() {
    await this.apiService.getAppsByProjectAndStatus(this.project.id, 0).then((res: HttpResponse<any>) => {
      if (!res.body.message) {
        this.apps = res.body;
      }
    }).catch(e => {
      console.log(e);
      this.snackBar.open('Не удалось загрузить заявки на проект', 'Закрыть', {duration: 4000});
    });
  }
}
