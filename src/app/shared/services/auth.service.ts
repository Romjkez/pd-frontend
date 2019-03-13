import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';

export function parseJwt(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  authChange = new Subject();
  constructor(private http: HttpClient, private router: Router) {
  }

  public login(email: string, pass: string): Promise<any> {
    const headers = new HttpHeaders('Content-Type: application/x-www-form-urlencoded');
    const params = new HttpParams().append('email', email).append('pass', pass);
    return this.http.post('http://new.std-247.ist.mospolytech.ru/api/user/auth.php', params, {headers}).toPromise();
  }

  public logout(): void {
    localStorage.clear();
    this.authChange.next();
    this.router.navigate(['/login']);
  }

  public getToken(): string {
    if (!!localStorage.getItem('token')) {
      return localStorage.getItem('token');
    }
    return '';
  }

  public getUserGroup(): number {
    const parsedToken = parseJwt(this.getToken());
    return parsedToken.data.usergroup;
  }

  isAuthorized(): boolean {
    return !!localStorage.getItem('token');
  }
}
