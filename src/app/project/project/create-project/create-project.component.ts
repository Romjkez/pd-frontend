import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../shared/services/api.service';
import {parseJwt} from '../../../shared/services/auth.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateProjectComponent implements OnInit {
  createProjectForm: FormGroup;
  tags: FormArray;
  private tagsMap = new Map<string, boolean>([
    ['Фронтенд', false],
    ['Бэкэнд', false],
    ['Веб-дизайн', false],
    ['Android', false],
    ['IOS-разработка', false],
    ['SMM', false]
  ]);
  tagsArray = Array.from(this.tagsMap.keys());

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    // todo CONSTRUCT MEMBERS OBJECT!
    // todo validate deadline
    this.tags = new FormArray([], [Validators.required]);
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

  toggleTag(tag: string) {
    if (this.tagsMap.get(tag) === false) {
      this.tagsMap.set(tag, true);
    } else {
      this.tagsMap.set(tag, false);
    }
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

  async requestCreateProject() {
    this.tagsMap.forEach((value, key) => {
      if (value === true) {
        this.tags.push(new FormControl(key));
      }
    });
    const curatorId = parseJwt(localStorage.getItem('token')).data.id;
    const data = this.serializeObject(this.createProjectForm.getRawValue()).concat('&curator=' + curatorId);
    await this.apiService.createProject(data).then((res) => {
        if (res.message) {
          console.log(res);
        }
      }
    ).catch(e => {
      console.error(e);
    }).finally(() => {
      this.tagsMap.forEach(value => value = false);
      this.tags.reset([]);
    });
  }

  serializeObject(obj: object): string {
    let str = '';
    for (const key in obj) {
      if (str !== '') {
        str += '&';
      }
      str += key + '=' + encodeURIComponent(obj[key]);
    }
    return str;
  }
}
