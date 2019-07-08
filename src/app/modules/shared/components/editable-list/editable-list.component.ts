import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material';
import {filter} from 'rxjs/operators';
import {tap} from 'rxjs/internal/operators/tap';

export interface ListItem {
  id: number;
  category?: string;
  value: string;
}

@Component({
  selector: 'app-editable-list',
  templateUrl: './editable-list.component.html',
  styleUrls: ['./editable-list.component.scss']
})
export class EditableListComponent implements OnInit {
  editingItem: ListItem;
  addingItem: ListItem;

  @Input() header: string;
  @Input() items: ListItem[];
  @Input() label_add: string;
  @Input() label_edit: string;
  @Input() label_remove: string;
  @Input() label_confirm: string;
  @Input() label_cancel: string;
  @Input() confirmRemove: boolean;
  @Input() removeModalQuestion: string;
  @Output() edited: EventEmitter<ListItem> = new EventEmitter();
  @Output() removed: EventEmitter<ListItem> = new EventEmitter();
  @Output() added: EventEmitter<ListItem> = new EventEmitter();
  @ViewChild('removeModal', {static: false}) removeModal: TemplateRef<any>;

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.label_add = this.label_add || 'Add item';
    this.label_edit = this.label_edit || 'Edit';
    this.label_remove = this.label_remove || 'Remove';
    this.label_cancel = this.label_cancel || 'Cancel';
    this.label_confirm = this.label_confirm || 'Confirm';
    this.removeModalQuestion = this.removeModalQuestion || 'Remove item?';
  }

  onEdit(item: ListItem): void {
    this.items.map(val => {
      if (val.id === item.id) {
        val = this.editingItem;
      }
    });
    this.edited.emit(this.editingItem);
    this.editingItem = null;
  }

  onRemove(item: ListItem): void {
    if (this.confirmRemove) {
      const dialogRef = this.dialog.open(this.removeModal);
      dialogRef.afterClosed().pipe(
        filter(result => result),
        tap(() => this.items = this.items.filter(val => val.id !== item.id)),
        tap(() => this.removed.emit(item))
      ).subscribe();
    } else {
      this.items = this.items.filter(val => val.id !== item.id);
      this.removed.emit(item);
    }
  }

  requestAddingItem(): void {
    this.addingItem = {
      id: -1,
      category: '',
      value: ''
    };
  }

  onAdd(): void {
    this.added.emit(this.addingItem);
    this.addingItem = null;
  }
}
