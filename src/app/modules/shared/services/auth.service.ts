import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {parseJwt} from '../utils/functions.util';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  authChange = new Subject();

  constructor(private userService: UserService, private router: Router) {
  }

  login(email: string, pass: string): Promise<any> {
    const params = `email=${email}&pass=${pass}`;
    return this.userService.authorizeUser(params);
  }

  logout(): void {
    localStorage.clear();
    this.authChange.next();
    this.router.navigate(['/login']);
  }

  getToken(): string {
    if (!!localStorage.getItem('token')) {
      return localStorage.getItem('token');
    }
    return '';
  }

  public getUserGroup(): number {
    const parsedToken = parseJwt(this.getToken());
    return parsedToken.data.usergroup;
  }

  public getUserId(): number {
    const parsedToken = parseJwt(this.getToken());
    return parsedToken.data.id;
  }

  isAuthorized(): boolean {
    return !!localStorage.getItem('token');
  }
}
