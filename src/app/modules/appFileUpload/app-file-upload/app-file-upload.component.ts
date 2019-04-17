import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders, HttpParams} from '@angular/common/http';


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
export class AppFileUploadComponent implements OnDestroy {

  constructor(
    private httpClient: HttpClient) {
  }

  public isUploading = false;


  /* Http request input bindings */
  httpUrl = 'http://new.std-247.ist.mospolytech.ru/api/file/';

  @Input()
  httpRequestHeaders: HttpHeaders | {
    [header: string]: string | string[];
  } = new HttpHeaders();

  @Input()
  httpRequestParams: HttpParams | {
    [param: string]: string | string[];
  } = new HttpParams();

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
  @Output() onUpload = new EventEmitter();

  public progressPercentage = 0;
  public loaded = 0;
  public total = 0;
  private _file: any;
  private _id: number;
  private fileUploadSubscription: any;

  public upload(): void {
    this.isUploading = true;
    // How to set the alias?
    const formData = new FormData();
    formData.set(this.fileAlias, this._file, this._file.name);
    this.fileUploadSubscription = this.httpClient.post(this.httpUrl, formData, {
      headers: this.httpRequestHeaders,
      observe: 'events',
      params: this.httpRequestParams,
      reportProgress: true,
      responseType: 'json'
    }).subscribe((event: any) => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progressPercentage = Math.floor(event.loaded * 100 / event.total);
        this.loaded = event.loaded;
        this.total = event.total;
      }
      this.onUpload.emit({file: this._file, event: event});
    }, (error: any) => {
      if (this.fileUploadSubscription) {
        this.fileUploadSubscription.unsubscribe();
      }
      this.isUploading = false;
      this.onUpload.emit({file: this._file, event: event});
    });
  }

  public remove(): void {
    if (this.fileUploadSubscription) {
      this.fileUploadSubscription.unsubscribe();
    }
    this.removeEvent.emit(this);
  }

  ngOnDestroy() {
    console.log('file ' + this._file.name + ' destroyed...');
  }
}
