import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export interface User {
  id: string;
  name: string;
  surname: string;
  middle_name: string;
  email: string;
  usergroup: string;
  phone: string;
  description: string;
  avatar: string;
  stdgroup: string;
}

export interface Projects {
  page: number;
  per_page: number;
  pages: number;
  data: null | [];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiKey = 'android';
  baseUrl = 'http://new.std-247.ist.mospolytech.ru/api';

  constructor(private http: HttpClient) {
  }

  /*
  ** USER
   */
  getUserByEmail(email: string): Promise<User> {
    return this.http.get<User>(this.baseUrl + '/user/get.php?api_key=' + this.apiKey + '&email=' + email).toPromise();
  }

  getUserBySurname(surname: string): Promise<User> {
    return this.http.get<User>(this.baseUrl + '/user/get.php?api_key=' + this.apiKey + '&surname=' + surname).toPromise();
  }

  getUserById(surname: string): Promise<User> {
    return this.http.get<User>(this.baseUrl + '/user/get.php?api_key=' + this.apiKey + '&id=' + surname).toPromise();
  }

  /*
  ** PROJECTS
   */
  getProjectsByStatus(status: number, perPage: number, page: number): Promise<Projects> {
    return this.http.get<Projects>(this.baseUrl + '/projects/get.php?status=' + status + '&per_page=' + perPage + '&page=' + page)
      .toPromise();
  }

  getProjectsByStatusAndCurator(status: number, curator: number | string, perPage: number, page: number) {
    return this.http.get<Projects>(
      this.baseUrl + '/projects/get.php?status=' + status + '&curator=' + curator + '&per_page=' + perPage + '&page=' + page)
      .toPromise();
  }
}
