import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../shared/services/api.service';
import {parseJwt} from '../../../shared/services/auth.service';
import {HttpResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';

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
  tagsMap = new Map<string, boolean>([
    ['Фронтенд', false],
    ['Бэкэнд', false],
    ['Веб-дизайн', false],
    ['Android', false],
    ['IOS-разработка', false],
    ['SMM', false],
    ['Маркетинг', false],
    ['3D-моделирование', false]
  ]);
  tagsArray = Array.from(this.tagsMap.keys());
  gotTags: object[];

  constructor(private apiService: ApiService, private snackBar: MatSnackBar, private router: Router) {
  }

  ngOnInit() {
    // todo validate deadline
    // this.gotTags=this.apiService.getTags();
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
    if (this.tagsMap.get(tag) === false) {
      this.tagsMap.set(tag, true);
    } else {
      this.tagsMap.set(tag, false);
    }

    for (let i = 0; i < Array.from(this.tagsMap.keys()).length; i++) {
      if (this.tagsMap.get(Array.from(this.tagsMap.keys())[i]) === true) {
        tagsCounter++;
      }
    }
    this.tagsMaximum = tagsCounter > 6;
  }

  back(): void {
    window.history.back();
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
    this.tagsMap.forEach((value, key) => {
      if (value === true) {
        this.tags.push(new FormControl(key));
      }
    });
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
        this.tagsMap.forEach(value => value = false);
        this.tags.reset([]);
      });
    }

  }

  private serializeObject(obj: object): string {
    let str = '';
    for (const key in obj) {
      if (key !== 'teamsCount' && key !== 'roles') {
        if (str !== '') {
          str += '&';
        }
        str += key + '=' + obj[key];
      }
    }
    return str;
  }
}
