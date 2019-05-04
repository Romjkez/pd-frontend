import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Project} from '../../models/project.model';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {
  @Input() currentPage = 1;
  @Input() perPage = 5;
  @Input() totalPages = 1;
  @Input() projects: Project[];
  @Input() id: string;
  @Output() switchPage: EventEmitter<{ newPage: number, id: string }> = new EventEmitter();

  onSwitchPage(newPage: number): void {
    this.currentPage = newPage;
    this.switchPage.emit({newPage: newPage, id: this.id});
  }
}
