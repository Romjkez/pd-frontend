import {Component, Input, OnInit} from '@angular/core';

export interface ItemsGroup {
  category?: string;
  items: string[];
}

@Component({
  selector: 'app-editable-list',
  templateUrl: './editable-list.component.html',
  styleUrls: ['./editable-list.component.css']
})
export class EditableListComponent implements OnInit {
  @Input() headers: string[];
  @Input() groups: ItemsGroup[];

  constructor() {
  }

  ngOnInit() {
  }

}
