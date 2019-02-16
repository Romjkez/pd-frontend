import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {HttpClientService} from './http-client.service';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private snackBar: MatSnackBar, private http: HttpClientService, private authService: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    return this.isAuthorized();
    /*if (!!localStorage.getItem('token')) {
      const headers = new HttpHeaders().append('X-Auth-Token', localStorage.getItem('token'));
      this.http.post('http://new.std-247.ist.mospolytech.ru/api/user/auth.php', null, {headers, observe: 'response'})
        .toPromise().then((res) => {
        localStorage.setItem('token', res.headers.get('X-Auth-Token'));
        return true;
      }).catch(e => {
        this.authService.logout();
        this.snackBar.open('Для просмотра контента нужна авторизация.', 'Закрыть', {duration: 2500});
        console.error(e);
        return false;
      });
    } else {
      this.router.navigate(['/login']);
      this.snackBar.open('Для просмотра контента нужна авторизация!', 'Закрыть', {duration: 2500});
      return false;
    }
*/
  }

  isAuthorized(): boolean {
    return !!localStorage.getItem('token');
  }
}
