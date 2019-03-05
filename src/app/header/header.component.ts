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
  email: string;

  constructor(public authService: AuthService, private apiService: ApiService) {
  }

  async ngOnInit() {
    if (this.authService.getToken()) {
      const parsedToken = parseJwt(this.authService.getToken());
      this.email = parsedToken.data.email;
      await this.apiService.getUserByEmail(this.email).then((res: User) => {
        this.user = res;
      }).catch(e => console.error(e));
    }
  }
}
