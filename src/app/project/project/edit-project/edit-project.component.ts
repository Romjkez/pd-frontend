import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {back, isMobile, parseJwt} from '../../../shared/utils/functions.util';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Tags} from '../../../shared/models/tags.model';
import {ApiService} from '../../../shared/services/api.service';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {Project} from '../../../shared/models/project.model';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {
  createProjectForm: FormGroup;
  tags: FormArray;
  tagsMaximum: boolean;
  gotTags: Tags[];
  checkedTags = {};
  minDate: Date;
  minFinishDate: Date;
  maxDate: Date;
  back = back;
  isMobile = isMobile;
  project: Project;
  loading: boolean;
  @ViewChild('submitButton') submitButton: ElementRef;

  constructor(private apiService: ApiService, private snackBar: MatSnackBar, private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.loading = true;
    // todo убрать СНЭКБАК и disabled у кнопки
    // todo запретить редактирование количества команд и ролей если статус = 1 или 2
    this.snackBar.open('Редактирование проекта временно недоступно!', 'Закрыть');
    Promise.all([
      this.apiService.getTags(),
      this.apiService.getProjectById(id)
    ])
      .then(([tags, project]) => {
        this.gotTags = tags;
        this.project = project;
      }).catch((e) => {
      this.snackBar.open(`Произошла ошибка: ${e}`, 'Закрыть');
      console.error(e);
    }).finally(() => {
      const date = new Date;
      this.minDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      this.maxDate = new Date(date.getFullYear(), date.getMonth() + 6, date.getDate());
      this.tags = new FormArray([]);
      this.createProjectForm = new FormGroup({
        title:
          new FormControl(this.project.title, [Validators.required, Validators.minLength((2)), Validators.maxLength(255)]),
        description:
          new FormControl(this.project.description, [Validators.required, Validators.minLength((2))]),
        deadline: new FormControl(this.project.deadline, [Validators.required]),
        finish_date: new FormControl(this.project.finish_date, [Validators.required]),
        roles: new FormControl('', [Validators.required]),
        teamsCount: new FormControl('', [Validators.required, Validators.min(1), Validators.max(10)]),
        tags: this.tags,
        avatar: new FormControl(this.project.avatar)
      });
      this.loading = false;
    });

  }

  toggleTag(tag: string): void {
    let tagsCounter = 0;
    if (this.checkedTags[tag] === true) {
      this.checkedTags[tag] = false;
    } else {
      this.checkedTags[tag] = true;
    }
    for (const prop in this.checkedTags) {
      if (this.checkedTags[prop] === true) {
        tagsCounter++;
      }
    }
    this.tagsMaximum = tagsCounter > 6;
  }

  getTextAreaCols(): { [key: string]: string } {
    let width: number;
    if (window.innerWidth > 1200) {
      width = (window.innerWidth / 4);
    } else {
      width = (window.innerWidth / 2);
    }
    return {'width': `${width}px`};
  }

  private makeTeams(): object[] {
    const result = [];
    const teams = <number>this.createProjectForm.controls.teamsCount.value;
    const members = this.createProjectForm.controls.roles.value.split(',');
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

  async requestCreateProject() {
    this.submitButton.nativeElement.setAttribute('disabled', 'true');
    for (const prop in this.checkedTags) {
      if (this.checkedTags[prop] === true) {
        this.tags.push(new FormControl(prop));
      }
    }
    if (this.tags.length < 1) {
      this.snackBar.open('Пожалуйста, укажите теги проекта', 'Закрыть');
      this.submitButton.nativeElement.removeAttribute('disabled');
    } else {
      const members = JSON.stringify(this.makeTeams());
      const curatorId = parseJwt(localStorage.getItem('token')).data.id;
      const data = this.serializeObject(this.createProjectForm.getRawValue()).concat(`&curator=${curatorId}&members=${members}`);
      await this.apiService.createProject(data).then(res => {
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
        this.snackBar.open(`Не удалось создать проект: ${e}`, 'Закрыть');
        console.error(e);
      }).finally(() => {
        this.checkedTags = {};
        this.tags.reset([]);
      });
    }

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
    const deadline = new Date(this.createProjectForm.controls.deadline.value._d);
    const finish = new Date(this.createProjectForm.controls.finish_date.value._d);
    str += `&deadline=${deadline.getFullYear()}-${deadline.getMonth() + 1}-${deadline.getDate()}`;
    str += `&finish_date=${finish.getFullYear()}-${finish.getMonth() + 1}-${finish.getDate()}`;
    return str;
  }

  onDeadlineChange(evt) {
    if (evt.value !== null) {
      this.minFinishDate = evt.value._d;
    }
  }

}
