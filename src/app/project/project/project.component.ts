import {Component, OnInit} from '@angular/core';
import {colorMap, Project, statusMap} from '../../shared/components/project-snippet/project-snippet.component';
import {ActivatedRoute, Router} from '@angular/router';
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

export interface Tags {
  category: string;
  value: string[];
}

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
})
export class ProjectComponent implements OnInit {
  project: Project;
  loading: boolean;
  joinForm: FormGroup;
  colorMap = colorMap;
  statusMap = statusMap;
  tags: string[];
  fullness = {
    occupied: 0,
    places: 0
  };
  joinRequested = false;
  usergroup: number;
  selfId: number;
  apps: Application[];

  constructor(private activatedRoute: ActivatedRoute, private apiService: ApiService, private snackBar: MatSnackBar,
              private router: Router) {
  }

  async ngOnInit() {
    this.loading = true;
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.joinForm = new FormGroup({
      team: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      comment: new FormControl('', [Validators.maxLength(255)])
    });
    Promise.all([
        this.apiService.getProjectById(id), this.apiService.getArchiveProjectById(<any>id)
      ]
    ).then(([res1, res2]) => {
      if (res1.id) {
        this.project = res1;
      } else if (res2.id) {
        this.project = res2;
      } else {
        this.router.navigate(['/404']);
      }
      this.project.files = JSON.parse(<any>this.project.files);
      this.getApps();
      this.fullness = this.getOccupiedQuantity(this.project.members);
      this.tags = this.project.tags.split(',');
      this.usergroup = parseJwt(localStorage.getItem('token')).data.usergroup;
      this.selfId = parseJwt(localStorage.getItem('token')).data.id;
      this.loading = false;
    }).catch(e => {
      console.error(e);
      this.loading = false;
    });
  }

  getOccupiedQuantity(members: object[]): { occupied: number, places: number } {
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
      } else {
        this.apps = [];
      }
    }).catch(e => {
      console.log(e);
      this.snackBar.open('Не удалось загрузить заявки на проект', 'Закрыть', {duration: 4000});
    });
  }
}
