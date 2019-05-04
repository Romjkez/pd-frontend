import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../models/user.model';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  registerUser(body: string): Promise<any> {
    const headers = new HttpHeaders('Content-Type: application/x-www-form-urlencoded');
    return this.http.post(`${this.baseUrl}/user/add.php`, body, {headers, observe: 'response'})
      .toPromise();
  }

  authorizeUser(body: string): Promise<any> {
    const headers = new HttpHeaders('Content-Type: application/x-www-form-urlencoded');
    return this.http.post(`${this.baseUrl}/user/auth.php`, body, {headers}).toPromise();
  }

  getUserById(id: number | string): Promise<User> {
    return this.http.get<User>(`${this.baseUrl}/user/get.php?id=${id}`).toPromise();
  }

  updateUser(user: object | any): Promise<any> {
    let data = `id=${user.id}&email=${user.email}&surname=${user.surname}&name=${user.name}&middlename=${user.middlename}
    &tel=${user.tel}&std_group=${user.std_group}&avatar=${user.avatar}&description=${user.description}
    &active_projects=${user.active_projects}&finished_projects=${user.finished_projects}`;
    if (user.pass.length > 5 && user.old_pass.length > 5) {
      data += `&pass=${user.pass}&old_pass=${user.old_pass}`;
    }
    return this.http.post(`${this.baseUrl}/user/update.php`, data, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      observe: 'response'
    }).toPromise();
  }

  // UNUSED METHODS

  /*getUserByEmail(email: string): Promise<User> {
    return this.http.get<User>(`${this.baseUrl}/user/get.php?email=${email}`).toPromise();
  }

  getUserBySurname(surname: string): Promise<User> | Promise<User[]> {
    return this.http.get<User>(`${this.baseUrl}/user/get.php?surname=${surname}`).toPromise();
  }*/
}
