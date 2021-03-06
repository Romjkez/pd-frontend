import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!!localStorage.getItem('token')) {
      const paramReq = req.clone({
        headers: req.headers.set('X-Auth-Token', localStorage.getItem('token')),
      });
      return next.handle(paramReq).pipe(
        tap(res => res instanceof HttpResponse && res.headers.get('X-Auth-Token') ?
          localStorage.setItem('token', res.headers.get('X-Auth-Token')) : true));
    } else {
      return next.handle(req);
    }
  }
}
