import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.isAuthorized()) {
      return true;
    } else {
      // this.snackBar.open('Для просмотра контента нужна авторизация.', 'Закрыть', {duration: 2500});
      return false;
    }
  }


  isAuthorized(): boolean {
    return !!localStorage.getItem('token');
  }
}
