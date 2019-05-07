import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ProjectsService} from '../../services/projects.service';
import {MatSnackBar} from '@angular/material';
import {Project} from '../../models/project.model';

@Component({
  selector: 'app-adm-project-snippet',
  templateUrl: './adm-project-snippet.component.html',
  styleUrls: ['./adm-project-snippet.component.css']
})
export class AdmProjectSnippetComponent implements OnInit {
  approveForm: FormGroup;
  @Input() project: Project;
  @Output() moderated: EventEmitter<number> = new EventEmitter();

  constructor(private projectsService: ProjectsService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.approveForm = new FormGroup({
      approve: new FormControl(),
      adm_comment: new FormControl('', [Validators.required])
    });
  }

  async updateProject(): Promise<any> {
    if (this.approveForm.controls.approve.value === 'true') {
      await this.projectsService.updateProjectStatus(this.project.id, 1, '')
        .then(res => {
          if (res.message === 'true') {
            this.snackBar.open('Статус проекта успешно обновлён', 'Закрыть', {duration: 3000});
            this.moderated.emit();
          }
        })
        .catch(e => {
          this.snackBar.open(`Не удалось обновить статус проекта: ${e.error.message || 'отсутствует соединение с интернетом'}`,
            'Закрыть', {duration: 5000});
          console.error(e);
        });
    } else if (this.approveForm.controls.approve.value === 'false') {
      if (this.approveForm.controls.adm_comment.value.trim().length > 0) {
        await this.projectsService.updateProjectStatus(this.project.id, 3, this.approveForm.controls.adm_comment.value)
          .then(res => {
            if (res.message === 'true') {
              this.snackBar.open('Статус проекта успешно обновлён', 'Закрыть', {duration: 3000});
              this.moderated.emit();
            } else {
              console.log(res.message);
            }
          }).catch(e => {
            this.snackBar.open(`Не удалось обновить статус проекта: ${e.error.message || 'отсутствует соединение с интернетом'}`,
              'Закрыть', {duration: 5000});
            console.error(e);
          });
      } else {
        this.snackBar.open('Укажите причину отказа в публикации', 'Закрыть', {duration: 4000});
      }
    }
  }
}
