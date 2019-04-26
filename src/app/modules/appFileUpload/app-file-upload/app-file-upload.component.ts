import {Component, EventEmitter, Input, Output} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';


/**
 * A material design file upload component.
 */
@Component({
  selector: 'app-file-upload',
  templateUrl: `./app-file-upload.component.html`,
  exportAs: 'appFileUpload',
  host: {
    'class': 'app-file-upload',
  },
  styleUrls: ['./app-file-upload.component.css'],
})
export class AppFileUploadComponent {

  constructor(
    private httpClient: HttpClient) {
  }

  public isUploading = false;

  /* Http request input bindings */
  httpUrl = `${environment.baseUrl}/file/`;
  @Input() project_id: number;

  @Input()
  httpRequestHeaders: HttpHeaders | {
    [header: string]: string | string[];
  } = new HttpHeaders();

  @Input()
  fileAlias = 'file';

  @Input()
  get file(): any {
    return this._file;
  }

  set file(file: any) {
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

  public progressPercentage = 0;
  public loaded = 0;
  public total = 0;
  private _file: any;
  private _id: number;
  private fileUploadSubscription: any;

  public upload(): void {
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

  public remove(): void {
    if (this.fileUploadSubscription) {
      this.fileUploadSubscription.unsubscribe();
    }
    this.removeEvent.emit(this);
  }
}
