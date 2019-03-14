import {Component, OnInit} from '@angular/core';
import {AuthService, parseJwt} from '../shared/services/auth.service';
import {ApiService, User} from '../shared/services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: User;
  id: number;

  constructor(public authService: AuthService, private apiService: ApiService) {
  }
  async ngOnInit() {
    this.authService.authChange.subscribe(event => {
      this.getHeaderData();
    });
    this.getHeaderData();
  }

  async getHeaderData(): Promise<any> {
    if (this.authService.getToken()) {
      const parsedToken = parseJwt(this.authService.getToken());
      this.id = parsedToken.data.id;
      await this.apiService.getUserById(this.id).then((res: User) => {
        this.user = res;
      }).catch(e => console.error(e));
    }
  }
}
