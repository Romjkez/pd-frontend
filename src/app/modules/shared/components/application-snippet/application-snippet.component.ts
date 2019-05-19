import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ParsedProjectApplication} from '../../models/application.model';

@Component({
  selector: 'app-application-snippet',
  templateUrl: './application-snippet.component.html',
  styleUrls: ['./application-snippet.component.scss']
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
