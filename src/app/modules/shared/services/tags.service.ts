import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Tag} from '../models/tags.model';
import {environment} from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TagsService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  getTags(): Promise<Tag[]> {
    return this.http.get<Tag[]>(`${this.baseUrl}/tags/`).toPromise();
  }

  editTag(tag: Tag): Promise<any> {
    return this.http.put(`${this.baseUrl}/tags/`, `id=${tag.id}&category=${tag.category}&value=${tag.value}`).toPromise();
  }

  addTag(tag: Tag): Promise<Tag> {
    return this.http.post<Tag>(`${this.baseUrl}/tags/`, `category=${tag.category}&value=${tag.value}`, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      observe: 'body'
    }).toPromise();
  }

  deleteTag(id: number): Promise<any> {
    return this.http.delete(`${this.baseUrl}/tags/?id=${id}`).toPromise();
  }
}
