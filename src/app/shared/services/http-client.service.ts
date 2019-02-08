import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// реализация базовых методов HTTP клиента
export class HttpClientService {
  constructor(private http: HttpClient) {
  }

  public get(url: string, header: HttpHeaders): Observable<any> {
    const options = {
      headers: header
    };
    return this.http.get(url, options);
  }

  public post(url: string, body, httpHeaders): Observable<any> {
    const headers = {
      headers: httpHeaders
    };
    return this.http.post(url, body, headers);
  }

}
