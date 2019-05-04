import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ProjectsService} from '../../services/projects.service';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {Project} from '../../models/project.model';

@Component({
  selector: 'app-adm-project-snippet',
  templateUrl: './adm-project-snippet.component.html',
  styleUrls: ['./adm-project-snippet.component.css']
})
export class AdmProjectSnippetComponent implements OnInit, OnDestroy {
  @Input() project: Project;
  approveForm: FormGroup;
  visible = true;

  constructor(private projectsService: ProjectsService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.approveForm = new FormGroup({
      approve: new FormControl(),
      adm_comment: new FormControl('', [Validators.required])
    });
  }

  ngOnDestroy(): void {
  }

  async updateProject(): Promise<any> {
    if (this.approveForm.controls.approve.value === 'true') {
      await this.projectsService.updateProjectStatus(this.project.id, 1, '').then((res: HttpResponse<any>) => {
        this.snackBar.open('Статус проекта успешно обновлён', 'Закрыть', {duration: 3000});
        this.visible = false;
      }).catch((e: HttpErrorResponse) => {
        this.snackBar.open('Не удалось обновить статус проекта', 'Закрыть', {duration: 3500});
        console.error(e);
      });
    } else if (this.approveForm.controls.approve.value === 'false') {
      if (this.approveForm.controls.adm_comment.value.trim().length > 0) {
        await this.projectsService.updateProjectStatus(this.project.id, 3, this.approveForm.controls.adm_comment.value);
        this.snackBar.open('Статус проекта успешно обновлён', 'Закрыть', {duration: 3000});
        this.visible = false;
      } else {
        this.snackBar.open('Укажите причину отказа в публикации', 'Закрыть', {duration: 3000});

      }

    }
  }
}