import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ApiMessage} from './chat.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  removeFile(fileId: number): Observable<ApiMessage> {
    return this.http.delete<ApiMessage>(`${this.baseUrl}/file/?file_id=${fileId}`, {observe: 'body'});
  }
}
