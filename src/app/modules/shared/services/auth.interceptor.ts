import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!!localStorage.getItem('token')) {
      const paramReq = req.clone({
        headers: req.headers.set('X-Auth-Token', localStorage.getItem('token'))
      });
      return next.handle(paramReq);
    } else {
      return next.handle(req);
    }
  }
}
