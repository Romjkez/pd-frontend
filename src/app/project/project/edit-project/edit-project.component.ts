import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {back, isMobile, parseJwt} from '../../../shared/utils/functions.util';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
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
  teamsInfo: { roles: string[], teams: number };
  fb = new FormBuilder();
  @ViewChild('submitButton') submitButton: ElementRef;

  constructor(private apiService: ApiService, private snackBar: MatSnackBar, private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.loading = true;
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    Promise.all([
      this.apiService.getTags(),
      this.apiService.getProjectById(id)
    ]).then(([tags, project]) => {
      this.gotTags = tags;
      this.project = project;
    }).then(() => {
      const date = new Date;
      this.minDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      this.maxDate = new Date(date.getFullYear(), date.getMonth() + 6, date.getDate());
      this.teamsInfo = this.getTeams(this.project.members);

      const tagsArray = this.project.tags.split(',');
      this.tags = this.fb.array(tagsArray);

      this.createProjectForm = new FormGroup({
        title:
          new FormControl(this.project.title, [Validators.required, Validators.minLength((2)), Validators.maxLength(255)]),
        description:
          new FormControl(this.project.description, [Validators.required, Validators.minLength((2))]),
        deadline: new FormControl(this.project.deadline, [Validators.required]),
        finish_date: new FormControl(this.project.finish_date, [Validators.required]),
        roles: new FormControl(this.teamsInfo.roles.slice(0), [Validators.required]),
        teamsCount: new FormControl(this.teamsInfo.teams, [Validators.required, Validators.min(1), Validators.max(10)]),
        tags: this.tags,
        avatar: new FormControl(this.project.avatar),
        files: new FormControl(this.project.files)
      });
      this.loading = false;
    }).catch((e) => {
      this.snackBar.open(`Произошла ошибка: ${e}`, 'Закрыть');
      console.error(e);
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
    console.log(this.createProjectForm.controls.roles.value);
    const members = this.createProjectForm.controls.roles.value;
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
      const data = this.serializeObject(this.createProjectForm.getRawValue()).concat(`&curator=${curatorId}&members=${members}
      &id=${this.project.id}`);
      await this.apiService.updateProject(data).then(res => {
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
        this.snackBar.open(`Не удалось отредактировать проект: ${e}`, 'Закрыть');
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
    const deadline = new Date(this.createProjectForm.controls.deadline.value);
    const finish = new Date(this.createProjectForm.controls.finish_date.value);
    str += `&deadline=${deadline.getFullYear()}-${deadline.getMonth() + 1}-${deadline.getDate()}`;
    str += `&finish_date=${finish.getFullYear()}-${finish.getMonth() + 1}-${finish.getDate()}`;
    return str;
  }

  onDeadlineChange(evt) {
    if (evt.value !== null) {
      this.minFinishDate = evt.value._d;
    }
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
