import {AfterViewInit, Component, ContentChildren, forwardRef, OnDestroy, QueryList} from '@angular/core';
import {merge, Observable, Subscription} from 'rxjs';
import {startWith} from 'rxjs/operators';
import {AppFileUploadComponent} from '../app-file-upload/app-file-upload.component';


/**
 * A material design file upload queue component.
 */
@Component({
  selector: 'app-file-upload-queue',
  templateUrl: `app-file-upload-queue.component.html`,
  exportAs: 'appFileUploadQueue',
  styleUrls: ['./app-file-upload-queue.component.css'],

})
export class AppFileUploadQueueComponent implements OnDestroy, AfterViewInit {

  @ContentChildren(forwardRef(() => AppFileUploadComponent)) fileUploads: QueryList<AppFileUploadComponent>;

  /** Subscription to remove changes in files. */
  private _fileRemoveSubscription: Subscription | null;

  /** Subscription to changes in the files. */
  private _changeSubscription: Subscription;

  /** Combined stream of all of the file upload remove change events. */
  get fileUploadRemoveEvents(): Observable<AppFileUploadComponent> {
    return merge(...this.fileUploads.map(fileUpload => fileUpload.removeEvent));
  }

  files: Array<any> = [];

  ngAfterViewInit() {
    // When the list changes, re-subscribe
    this._changeSubscription = this.fileUploads.changes.pipe(startWith(null)).subscribe(() => {
      if (this._fileRemoveSubscription) {
        this._fileRemoveSubscription.unsubscribe();
      }
      this._listenTofileRemoved();
    });
  }

  private _listenTofileRemoved(): void {
    this._fileRemoveSubscription = this.fileUploadRemoveEvents.subscribe((event: AppFileUploadComponent) => {
      this.files.splice(event.id, 1);
    });
  }

  add(file: any) {
    this.files.push(file);
  }

  uploadAll() {
    this.fileUploads.forEach((fileUpload) => {
      fileUpload.upload();
    });
  }

  removeAll() {
    this.files.splice(0, this.files.length);
  }

  ngOnDestroy() {
    if (this.files) {
      this.removeAll();
    }
  }

}
