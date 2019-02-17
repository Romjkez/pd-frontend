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

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiKey = 'android';
  baseUrl = 'http://new.std-247.ist.mospolytech.ru';

  constructor(private http: HttpClient) {
  }

  getUserByEmail(email: string): Promise<User> {
    return this.http.get<User>(this.baseUrl + '/api/user/get.php?api_key=' + this.apiKey + '&email=' + email).toPromise();
  }

  getUserBySurname(surname: string): Promise<User> {
    return this.http.get<User>(this.baseUrl + '/api/user/get.php?api_key=' + this.apiKey + '&surname=' + surname).toPromise();
  }

  getUserById(surname: string): Promise<User> {
    return this.http.get<User>(this.baseUrl + '/api/user/get.php?api_key=' + this.apiKey + '&id=' + surname).toPromise();
  }
}
