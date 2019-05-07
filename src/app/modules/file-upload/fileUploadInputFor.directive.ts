import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {AppFileUploadQueueComponent} from './app-file-upload-queue/app-file-upload-queue.component';

@Directive({
  selector: '[appFileUploadInputFor]'
})
export class FileUploadInputForDirective {
  private _queue: AppFileUploadQueueComponent;
  private _element: HTMLElement;

  constructor(private element: ElementRef) {
    this._element = this.element.nativeElement;
  }

  @Input('appFileUploadInputFor')
  set fileUploadQueue(value: AppFileUploadQueueComponent) {
    if (value) {
      this._queue = value;
    }
  }

  @HostListener('change')
  onChange(): void {
    const files = this.element.nativeElement.files;

    for (let i = 0; i < files.length; i++) {
      this._queue.add(files[i]);
    }
    this.element.nativeElement.value = '';
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    const files = event.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
      this._queue.add(files[i]);
    }
    event.preventDefault();
    event.stopPropagation();
    this.element.nativeElement.value = '';
  }

  @HostListener('dragover', ['$event'])
  onDropOver(event: DragEvent): void {
    event.preventDefault();
  }
}
