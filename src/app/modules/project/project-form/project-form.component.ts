import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDatepickerInputEvent, MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {Project} from '../../shared/models/project.model';
import {ProjectsService} from '../../shared/services/projects.service';
import {TagsService} from '../../shared/services/tags.service';
import {back, isMobile, parseJwt} from '../../shared/utils/functions.util';
import {Tag} from '../../shared/models/tags.model';
import {FileService} from '../../shared/services/file.service';
import {catchError, filter, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {AuthService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent implements OnInit {
  back = back;
  isMobile = isMobile;

  loading: boolean;
  projectForm: FormGroup;
  minApplyFinishDate: Date; // minimum date of finishing getting user applies
  maxApplyFinishDate: Date; // maximum date of finishing getting user applies
  minProjectFinishDate: Date; // minimum date of finishing project
  project: Project | null;
  tagsList: Tag[]; // tags list received from server
  teamsInfo: { roles: string[], teams: number };
  checkedTagsList: string[] = [];

  @ViewChild('submitButton', {static: true}) submitButton: ElementRef;

  @Input() isEditingProject: boolean;

  constructor(private projectsService: ProjectsService, private snackBar: MatSnackBar, private router: Router,
              private activatedRoute: ActivatedRoute, private tagsService: TagsService, private fileService: FileService,
              private authService: AuthService) {
  }

  async ngOnInit() {
    this.loading = true;
    if (this.isEditingProject) {
      const id = this.activatedRoute.snapshot.paramMap.get('id');
      await Promise.all([
        this.tagsService.getTags(),
        this.projectsService.getProjectById(id)
      ]).then(([tags, project]) => {
        this.tagsList = tags;
        this.project = project;

        this.teamsInfo = this.getTeams(this.project.members);
        const tagsArray = this.project.tags.split(',');
        tagsArray.forEach((value, i) => {
          if (value.length === 0) { // escape empty tags
            tagsArray.splice(i, 1);
          }
        });
        this.checkedTagsList = tagsArray;

        this.projectForm = new FormGroup({
          id: new FormControl(+this.project.id),
          title:
            new FormControl(this.project.title, [Validators.required, Validators.minLength((2)), Validators.maxLength(255)]),
          description:
            new FormControl(this.project.description, [Validators.required, Validators.minLength((2))]),
          deadline: new FormControl(this.project.deadline, [Validators.required]),
          finish_date: new FormControl(this.project.finish_date, [Validators.required]),
          roles: new FormControl(this.teamsInfo.roles.slice(0), [Validators.required]),
          teamsCount: new FormControl(this.teamsInfo.teams, [Validators.required, Validators.min(1), Validators.max(10)]),
          tags: new FormArray([]),
          avatar: new FormControl(this.project.avatar),
          files: new FormControl(this.project.files)
        });
      }).catch((e) => {
        this.snackBar.open(`Ошибка: ${e.error.message || 'отсутствует соединение с интернетом'}`, 'Закрыть');
        console.error(e);
      }).finally(() => this.loading = false);
    } else {
      await this.tagsService.getTags().then((res) => {
        this.tagsList = res;
        this.projectForm = new FormGroup({
          title:
            new FormControl('', [Validators.required, Validators.minLength((2)), Validators.maxLength(255)]),
          description:
            new FormControl('', [Validators.required, Validators.minLength((2))]),
          deadline: new FormControl('', [Validators.required]),
          finish_date: new FormControl('', [Validators.required]),
          roles: new FormControl('', [Validators.required]),
          teamsCount: new FormControl('', [Validators.required, Validators.min(1), Validators.max(10)]),
          tags: new FormArray([]),
          avatar: new FormControl(''),
          files: new FormControl('')
        });
      }).catch(e => {
        this.snackBar.open(`Ошибка: ${e.error.message || 'отсутствует соединение с интернетом'}`, 'Закрыть', {duration: 5000});
        console.error(e);
        }
      ).finally(() => this.loading = false);
    }
    const date = new Date;
    this.minApplyFinishDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    this.maxApplyFinishDate = new Date(date.getFullYear(), date.getMonth() + 6, date.getDate());
  }

  async submitProjectForm() {
    this.submitButton.nativeElement.setAttribute('disabled', 'true');
    this.checkedTagsList.forEach(value => {
      (<FormArray>this.projectForm.controls.tags).push(new FormControl(value));
    });
    if ((<FormArray>this.projectForm.controls.tags).length < 1) {
      this.snackBar.open('Пожалуйста, укажите теги проекта', 'Закрыть');
      this.submitButton.nativeElement.removeAttribute('disabled');
    } else {
      const members = JSON.stringify(this.makeTeams());
      const curatorId = parseJwt(localStorage.getItem('token')).data.id;
      const data = this.serializeObject(this.projectForm.getRawValue()).concat(`&curator=${curatorId}&members=${members}`);

      if (this.isEditingProject) {
        await this.projectsService.updateProject(data).then(res => {
            if (res.message === 'true') {
              this.snackBar.open('Проект отредактирован', 'Закрыть', {duration: 3000});
              this.router.navigate(['/cabinet']);
            } else {
              this.submitButton.nativeElement.removeAttribute('disabled');
              this.snackBar.open(`Не удалось отредактировать проект: ${res.message}`, 'Закрыть');
            }
          }
        ).catch(e => {
          this.submitButton.nativeElement.removeAttribute('disabled');
          this.snackBar.open(`Не удалось отредактировать проект: ${e.error.message || 'отсутствует соединение с интернетом'}`,
            'Закрыть');
          console.error(e);
        }).finally(() => this.projectForm.controls.tags = new FormArray([]));
      } else {
        await this.projectsService.createProject(data).then(res => {
            if (res.message === 'true') {
              this.snackBar.open('Проект создан и отправлен на модерацию', 'Закрыть', {duration: 3000});
              this.router.navigate(['/cabinet']);
            } else {
              this.submitButton.nativeElement.removeAttribute('disabled');
              this.snackBar.open(`Не удалось создать проект: ${res.message}`, 'Закрыть');
            }
          }
        ).catch(e => {
          this.submitButton.nativeElement.removeAttribute('disabled');
          this.snackBar.open(`Не удалось создать проект: ${e.error.message || 'отсутствует соединение с интернетом'}`,
            'Закрыть');
          console.error(e);
        });
      }
    }
  }

  onApplyFinishDateChange(event: MatDatepickerInputEvent<any>): void {
    if (event.value !== null) {
      this.minProjectFinishDate = event.value._d;
    }
  }

  removeDocument(fileId: number, index: number): void {
    this.fileService.removeFile(fileId)
      .pipe(
        filter(res => res.message === 'true'),
        tap(() => this.project.files.splice(index, 1)),
        tap(() => this.snackBar.open('Документ успешно удалён', 'Закрыть', {duration: 3000})),
        catchError(e => {
          if (e.status === 401) {
            this.authService.logout();
            return of(this.snackBar.open(`Ошибка: ${e.error.message}`, 'Закрыть', {duration: 5000}));
          } else {
            return of(this.snackBar.open(`Ошибка при удалении документа: ${e.error.message || 'отсутствует интернет-соединение'}`,
              'Закрыть'));
          }
        }))
      .subscribe();
  }

  private makeTeams(): object[] {
    const result = [];
    const teams = <number>this.projectForm.controls.teamsCount.value;
    const members = this.projectForm.controls.roles.value.toString().split(',');
    for (let i = 0; i < teams; i++) {
      const team = {};
      for (let j = 0; j < members.length; j++) {
        const member = members[j].trim();
        if (member.length > 0) {
          team[members[j].trim()] = 0;
        }
      }
      result.push(team);
    }
    return result;
  }

  private serializeObject(obj: object): string {
    let str = '';
    for (const key in obj) {
      if (key !== 'teamsCount' && key !== 'roles' && key !== 'deadline' && key !== 'finish_date') {
        if (str !== '') {
          str += '&';
        }
        str += key + '=' + obj[key];
      }
    }
    const deadline = new Date(this.projectForm.controls.deadline.value);
    const finish = new Date(this.projectForm.controls.finish_date.value);
    str += `&deadline=${deadline.getFullYear()}-${deadline.getMonth() + 1}-${deadline.getDate()}`;
    str += `&finish_date=${finish.getFullYear()}-${finish.getMonth() + 1}-${finish.getDate()}`;
    return str;
  }

  private getTeams(members: any[]): { teams: number, roles: string[] } {
    const result = {
      teams: 0,
      roles: []
    };
    for (let i = 0; i < members.length; i++) {
      if (i === 0) {
        const team = members[i];
        for (const role in team) {
          if (role) {
            result.roles.push(role);
          }
        }
      }
      result.teams++;
    }
    return result;
  }
}
