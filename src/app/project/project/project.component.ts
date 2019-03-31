import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {colorMap, Project, statusMap} from '../../shared/components/project-snippet/project-snippet.component';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService, User} from '../../shared/services/api.service';
import {AuthService, parseJwt} from '../../shared/services/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatOptionSelectionChange, MatSnackBar} from '@angular/material';

export interface ParsedWorkerApplication {
  id: number;
  worker_id: User;
  project_id: number;
  team: number;
  role: string;
  status: number;
  comment: string | null;
}

export interface ParsedProjectApplication {
  id: number;
  worker_id: number;
  project_id: Project;
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
  apps: ParsedWorkerApplication[];
  @ViewChild('joinFormSubmit') joinFormSubmit: ElementRef;

  constructor(private activatedRoute: ActivatedRoute, private apiService: ApiService, private snackBar: MatSnackBar,
              private router: Router, public authService: AuthService) {
  }

  async ngOnInit() {
    this.loading = true;
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.joinForm = new FormGroup({
      team: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      comment: new FormControl('', [Validators.maxLength(255)])
    });
    this.getProject(id);
    this.apiService.isWorkerRequestedJoin(this.authService.getUserId(), <any>id).then(res => {
      if (res.message === 'true') {
        this.joinRequested = true;
      }
    });
  }

  getOccupiedQuantity(members: object[]): { occupied: number, places: number } {
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
    return {
      occupied: occupied,
      places: places
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
    this.joinFormSubmit.nativeElement.setAttribute('disabled', 'true');
    const projectId = this.project.id;
    const workerId = parseJwt(localStorage.getItem('token')).data.id;
    const team = this.joinForm.controls.team.value;
    const role = this.joinForm.controls.role.value;
    const comment = this.joinForm.controls.comment.value;
    await this.apiService.createApp(workerId, projectId, team, role, comment).then(res => {
      if (res.message === 'true') {
        this.snackBar.open(`Заявка подана: ${role}, команда №${team + 1}`, '', {duration: 4000});
        this.joinRequested = true;
      } else {
        this.snackBar.open(`Ошибка: ${res.message}`, 'Закрыть');
      }
      this.joinFormSubmit.nativeElement.removeAttribute('disabled');
    }).catch(e => {
      this.snackBar.open('Не удалось подать заявку. Возможно, кого-то уже взяли на эту позицию', 'Закрыть', {duration: 4000});
      console.error(e);
      this.joinFormSubmit.nativeElement.removeAttribute('disabled');
    });
  }

  async getApps() {
    await this.apiService.getAppsByProjectAndStatus(this.project.id, 0).then(res => {
      if (!res.message) {
        this.apps = res;
      } else {
        this.apps = [];
      }
    }).catch(e => {
      console.log(e);
      this.snackBar.open('Не удалось загрузить заявки на проект', 'Закрыть', {duration: 4000});
    });
  }

  async acceptApplication(id: number) {
    this.apiService.updateApp(id, 1).then(res => {
      if (res.message === 'true') {
        this.snackBar.open(`Заявка одобрена`, 'Закрыть', {duration: 4000});
        this.getApps();
      } else {
        this.snackBar.open(`Ошибка при одобрении: ${res.message}`, 'Закрыть');
      }
      this.getProject(this.activatedRoute.snapshot.paramMap.get('id'));
    }).catch(e => {
      this.snackBar.open(`Ошибка: ${e}`, 'Закрыть');
      console.error(e);
    });
  }

  async declineApplication(id: number) {
    this.apiService.updateApp(id, 2).then(res => {
      if (res.message === 'true') {
        this.snackBar.open(`Заявка отклонена`, 'Закрыть', {duration: 4000});
        this.getApps();
      } else {
        this.snackBar.open(`Ошибка при отказе: ${res.message}`, 'Закрыть');
      }
    }).catch(e => {
      this.snackBar.open(`Ошибка: ${e}`, 'Закрыть');
      console.error(e);
    });
  }

  async getProject(id) {
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
      this.selfId = this.authService.getUserId();
      this.loading = false;
    }).catch(e => {
      console.error(e);
      this.loading = false;
    });
  }
}
