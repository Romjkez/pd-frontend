import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {ProjectDocument} from '../../shared/models/project.model';

@Component({
  selector: 'app-file-upload-modal',
  templateUrl: './file-upload-modal.component.html',
  styleUrls: ['./file-upload-modal.component.scss']
})
export class FileUploadModalComponent {
  result: ProjectDocument[] = [];
  constructor(private dialogRef: MatDialogRef<FileUploadModalComponent>, private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: { project_id: number }) {
  }

  close(): void {
    this.dialogRef.close('123');
  }

  onUpload(event: HttpErrorResponse | HttpResponse<any>): void {
    if (event.type === 4) {
      this.result.push((<HttpResponse<any>>event).body.message);
      this.snackBar.open('Успешно загружено', 'Закрыть', {duration: 3500});
    } else if (event.status === 0) {
      this.snackBar.open('Не удалось загрузить файл. \nПроверьте соединение с интернетом', 'Закрыть', {duration: 5000});
    } else {
      const errorResponse = <HttpErrorResponse>event;
      if (errorResponse.error && errorResponse.error.message) {
        console.error(event);
        this.snackBar.open(`Ошибка: ${errorResponse.error.message}`, 'Закрыть', {duration: 5000});
      }
    }
  }

  onError(message: string) {
    this.snackBar.open(message, 'Закрыть');
  }
}
