import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  /*back = back;
  isMobile = isMobile;

  loading: boolean;
  projectForm: FormGroup;
  minApplyFinishDate: Date; // minimum date of finishing getting user applies
  maxApplyFinishDate: Date; // maximum date of finishing getting user applies
  minProjectFinishDate: Date; // minimum date of finishing project
  project: Project | null;
  tagsList: Tag[]; // tags list received from server
  @ViewChild('submitButton') submitButton: ElementRef;


  @Input()
  isEditingProject: boolean;

  constructor(private apiService: ApiService, private snackBar: MatSnackBar, private router: Router,
              private activatedRoute: ActivatedRoute) {
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
      const data = this.serializeObject(this.projectForm.getRawValue()).concat(`&curator=${curatorId}&members=${members}
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
      }).finally(() => this.projectForm.controls.tags = new FormArray([]));
    }
  }

  onApplyFinishDateChange(event: MatDatepickerInputEvent<any>): void {
    if (event.value !== null) {
      this.minProjectFinishDate = event.value._d;
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
  }*/
  ngOnInit() {
  }
}
