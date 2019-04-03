import {Component, Input, OnInit} from '@angular/core';
import {ParsedProjectApplication} from '../../../project/project/project.component';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-application-snippet',
  templateUrl: './application-snippet.component.html',
  styleUrls: ['./application-snippet.component.css']
})
export class ApplicationSnippetComponent implements OnInit {
  @Input() application: ParsedProjectApplication;
  usergroup: number;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.usergroup = this.authService.getUserGroup();
  }

}
