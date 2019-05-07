import {Component, EventEmitter, Input, Output} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-file-upload',
  templateUrl: `./app-file-upload.component.html`,
  host: {
    'class': 'app-file-upload',
  },
  styleUrls: ['./app-file-upload.component.css'],
})
export class AppFileUploadComponent {

  constructor(
    private httpClient: HttpClient) {
  }

  isUploading = false;

  httpUrl = `${environment.baseUrl}/file/`;
  @Input() project_id: number;

  @Input()
  httpRequestHeaders: HttpHeaders | {
    [header: string]: string | string[];
  } = new HttpHeaders();

  @Input()
  fileAlias = 'file';

  @Input()
  get file(): File {
    return this._file;
  }

  set file(file: File) {
    this._file = file;
    this.total = this._file.size;
  }

  @Input()
  set id(id: number) {
    this._id = id;
  }

  get id(): number {
    return this._id;
  }

  /** Output  */
  @Output() removeEvent = new EventEmitter<AppFileUploadComponent>();
  @Output() uploaded = new EventEmitter();

  progressPercentage = 0;
  loaded = 0;
  total = 0;
  private _file: any;
  private _id: number;
  private fileUploadSubscription: any;

  upload(): void {
    this.isUploading = true;

    const formData = new FormData();
    formData.set(this.fileAlias, this._file, this._file.name);
    this.fileUploadSubscription = this.httpClient.post(this.httpUrl, formData, {
      headers: this.httpRequestHeaders,
      observe: 'events',
      params: new HttpParams().append('project_id', this.project_id.toString()),
      reportProgress: true,
      responseType: 'json'
    }).subscribe((event: any) => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progressPercentage = Math.floor(event.loaded * 100 / event.total);
        this.loaded = event.loaded;
        this.total = event.total;
      }
      this.uploaded.emit(event);
    }, (error: any) => {
      if (this.fileUploadSubscription) {
        this.fileUploadSubscription.unsubscribe();
      }
      this.isUploading = false;
      this.uploaded.emit(error);
    });
  }

  remove(): void {
    if (this.fileUploadSubscription) {
      this.fileUploadSubscription.unsubscribe();
    }
    this.removeEvent.emit(this);
  }
}
