import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../shared/services/api.service';
import {parseJwt} from '../../../shared/services/auth.service';
import {HttpResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {Tags} from '../project.component';
import * as _moment from 'moment';

const moment = _moment;

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateProjectComponent implements OnInit {
  createProjectForm: FormGroup;
  tags: FormArray;
  tagsMaximum: boolean;
  gotTags: Tags[];
  gotTagsArray = [];
  checkedTags = {};
  minDate: Date;
  maxDate: Date;

  constructor(private apiService: ApiService, private snackBar: MatSnackBar, private router: Router) {
  }

  ngOnInit() {
    this.apiService.getTags().then(res => {
      this.gotTags = res;
      this.gotTagsArray = Object.keys(this.gotTags);
    });
    const date = new Date;
    this.minDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    this.maxDate = new Date(date.getFullYear(), date.getMonth() + 6, date.getDate());
    this.tags = new FormArray([]);
    this.createProjectForm = new FormGroup({
      title:
        new FormControl('', [Validators.required, Validators.minLength((2)), Validators.maxLength(255)]),
      description:
        new FormControl('', [Validators.required, Validators.minLength((2))]),
      deadline: new FormControl('', [Validators.required]),
      roles: new FormControl('', [Validators.required]),
      teamsCount: new FormControl('', [Validators.required, Validators.min(1), Validators.max(10)]),
      tags: this.tags
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
        team[members[j].trim()] = 0;
      }
      result.push(team);
    }
    return result;
  }

  async requestCreateProject() {
    for (const prop in this.checkedTags) {
      if (this.checkedTags[prop] === true) {
        this.tags.push(new FormControl(prop));
      }
    }
    if (this.tags.length < 1) {
      this.snackBar.open('Пожалуйста, укажите теги проекта', 'Закрыть');
    } else {
      const members = JSON.stringify(this.makeTeams());
      const curatorId = parseJwt(localStorage.getItem('token')).data.id;
      const data = this.serializeObject(this.createProjectForm.getRawValue()).concat(`&curator=${curatorId}&members=${members}`);
      await this.apiService.createProject(data).then((res: HttpResponse<any>) => {
          if (res.status === 201) {
            this.snackBar.open('Проект создан и отправлен на модерацию', 'Закрыть', {duration: 3000});
            this.router.navigate(['/cabinet']);
          } else {
            this.snackBar.open('Не удалось создать проект');
          }
        }
      ).catch(e => {
        this.snackBar.open('Не удалось создать проект');
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
      if (key !== 'teamsCount' && key !== 'roles' && key !== 'deadline') {
        if (str !== '') {
          str += '&';
        }
        str += key + '=' + obj[key];
      }
    }
    const deadline = new Date(this.createProjectForm.controls.deadline.value._d);
    str += `&deadline=${deadline.getFullYear()}-${deadline.getMonth() + 1}-${deadline.getDate()}`;
    return str;
  }

  isMobile(): boolean {
    return window.innerWidth < 767;
  }

  back(): void {
    window.history.back();
  }
}
