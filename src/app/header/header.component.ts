import {Component, OnInit} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';
import {parseJwt} from '../shared/utils/functions.util';
import {User} from '../shared/models/user.model';
import {UserService} from '../shared/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: User;
  id: number;

  constructor(public authService: AuthService, private userService: UserService) {
  }
  async ngOnInit() {
    this.authService.authChange.subscribe(() => this.getHeaderData());
    this.getHeaderData();
  }

  async getHeaderData(): Promise<any> {
    if (this.authService.getToken()) {
      const parsedToken = parseJwt(this.authService.getToken());
      this.id = parsedToken.data.id;
      await this.userService.getUserById(this.id).then((res: User) => {
        this.user = res;
      }).catch(e => console.error(e));
    }
  }
}
