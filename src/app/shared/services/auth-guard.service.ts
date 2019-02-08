import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private snackBar: MatSnackBar) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.isAuthorized()) {
      return true;
    } else {
      this.snackBar.open('Для просмотра контента нужна авторизация.', 'Закрыть', {duration: 2500});
      this.router.navigate(['/login']);
      return false;
    }
  }

  isAuthorized(): boolean {
    return !!localStorage.getItem('token');
  }
}
