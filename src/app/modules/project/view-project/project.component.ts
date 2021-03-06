import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatOptionSelectionChange, MatSnackBar} from '@angular/material';
import {HttpResponse} from '@angular/common/http';
import {Project} from '../../shared/models/project.model';
import {colorMap, statusMap} from '../../shared/components/project-snippet/project-snippet.component';
import {ProjectsService} from '../../shared/services/projects.service';
import {FileUploadModalComponent} from '../../file-upload/file-upload-modal/file-upload-modal.component';
import {AuthService} from '../../shared/services/auth.service';
import {parseJwt} from '../../shared/utils/functions.util';
import {ApplicationsService} from '../../shared/services/applications.service';
import {ParsedWorkerApplication} from '../../shared/models/application.model';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
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
  membersIds: number[] = [];
  apps: ParsedWorkerApplication[];
  @ViewChild('joinFormSubmit', {static: false}) joinFormSubmit: ElementRef;
  @ViewChild('confirmDeletionDialog', {static: false}) confirmDeletionDialog: TemplateRef<any>;

  constructor(private activatedRoute: ActivatedRoute, private applicationsService: ApplicationsService, private snackBar: MatSnackBar,
              private router: Router, public authService: AuthService, public matDialog: MatDialog,
              private projectsService: ProjectsService) {
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
    if (this.authService.isAuthorized()) {
      this.applicationsService.isWorkerRequestedJoin(this.authService.getUserId(), <any>id).then(res => {
        if (res.message === 'true') {
          this.joinRequested = true;
          this.loading = false;
        }
      });
    } else {
      this.joinRequested = true;
      this.loading = false;
    }
  }

  getOccupiedQuantity(members: object[]): { occupied: number, places: number } {
    let occupied = 0;
    let places = 0;
    for (let i = 0; i < members.length; i++) {
      // tslint:disable-next-line
      for (const key in members[i]) {
        if (members[i][key] !== 0) {
          occupied++;
          this.membersIds.push(members[i][key].id);
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
    await this.applicationsService.createApp(workerId, projectId, team, role, comment).then(res => {
      if (res.message === 'true') {
        this.snackBar.open(`Заявка подана: ${role}, команда №${team + 1}`, '', {duration: 4000});
        this.joinRequested = true;
      } else {
        this.snackBar.open(`Ошибка: ${res.message}`, 'Закрыть');
      }
      this.joinFormSubmit.nativeElement.removeAttribute('disabled');
    }).catch(e => {
      this.snackBar.open(`Не удалось подать заявку. ${e.error.message || 'отсутствует соединение с интернетом'}`,
        'Закрыть', {duration: 4000});
      console.error(e);
      this.joinFormSubmit.nativeElement.removeAttribute('disabled');
    });
  }

  async getApps() {
    await this.applicationsService.getAppsByProjectAndStatus(this.project.id, 0).then(res => {
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
    this.applicationsService.updateApp(id, 1).then(res => {
      if (res.message === 'true') {
        this.snackBar.open(`Заявка одобрена`, 'Закрыть', {duration: 4000});
        this.getApps();
      } else {
        this.snackBar.open(`Ошибка при одобрении: ${res.message}`, 'Закрыть');
      }
      this.getProject(this.activatedRoute.snapshot.paramMap.get('id'));
    }).catch(e => {
      this.snackBar.open(`Ошибка: ${e.error.message || 'отсутствует соединение с интернетом'}`, 'Закрыть');
      console.error(e);
    });
  }

  async declineApplication(id: number) {
    this.applicationsService.updateApp(id, 2).then(res => {
      if (res.message === 'true') {
        this.snackBar.open(`Заявка отклонена`, 'Закрыть', {duration: 4000});
        this.getApps();
      } else {
        this.snackBar.open(`Ошибка при отказе: ${res.message}`, 'Закрыть');
      }
    }).catch(e => {
      this.snackBar.open(`Ошибка: ${e.error.message || 'отсутствует соединение с интернетом'}`, 'Закрыть');
      console.error(e);
    });
  }

  async getProject(id) {
    Promise.all([
      this.projectsService.getProjectById(id), this.projectsService.getArchiveProjectById(<any>id)
      ]
    ).then(([res1, res2]) => {
      if (res1.id) {
        this.project = res1;
      } else if (res2.id) {
        this.project = res2;
      } else {
        this.router.navigate(['/404']);
      }
      this.getApps();
      this.fullness = this.getOccupiedQuantity(this.project.members);
      this.tags = this.project.tags.split(',');
      if (this.authService.isAuthorized()) {
        this.usergroup = parseJwt(localStorage.getItem('token')).data.usergroup;
        this.selfId = this.authService.getUserId();
      } else {
        this.usergroup = -1;
        this.selfId = -1;
      }
    }).catch(e => {
      this.snackBar.open(`Ошибка: ${e.error.message || 'отсутствует соединение с интернетом'} `, 'Закрыть');
      console.error(e);
    }).finally(() => this.loading = false);
  }

  async requestModeration(event: MouseEvent): Promise<void> {
    if (event.isTrusted) {
      await this.projectsService.updateProjectStatus(this.project.id, 0, '')
        .then((res: HttpResponse<any>) => {
          if (res.body.message === 'true') {
            this.snackBar.open('Проект отправлен на повторную модерацию', 'OK', {duration: 3000});
          } else {
            this.snackBar.open('Не удалось отправить проект на модерацию ', 'Закрыть');
          }
        })
        .catch(e => console.error(e))
        .finally(
          () => this.getProject(this.activatedRoute.snapshot.paramMap.get('id'))
        );
    }
  }

  async deleteProject() {
    this.projectsService.deleteProject(this.project.id)
      .then(res => {
        if (res.message === 'true') {
          this.snackBar.open('Проект успешно удалён', 'ОК', {duration: 3500});
          this.router.navigate(['/cabinet']);
        } else {
          this.snackBar.open(`Ошибка: ${res.message}`, 'Закрыть');
        }
      })
      .catch(e => console.error(e));
  }

  openUploadModal() {
    this.matDialog.open(FileUploadModalComponent, {data: {project_id: +this.project.id}});
    // todo Добавить динамическое обновление списка документов при загрузке
    /*dialogRef.afterClosed().pipe(
      tap((res) => console.log(res))
    );*/
  }
}
