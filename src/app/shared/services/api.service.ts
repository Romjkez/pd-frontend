import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Project} from '../components/project-snippet/project-snippet.component';
import {Tags} from '../../project/project/project.component';

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
    return this.http.get<User>(`${this.baseUrl}/user/get.php?api_key=${this.apiKey}&email=${email}`).toPromise();
  }

  getUserBySurname(surname: string): Promise<User> {
    return this.http.get<User>(`${this.baseUrl}/user/get.php?api_key=${this.apiKey}&surname=${surname}`).toPromise();
  }

  getUserById(id: number | string): Promise<User> {
    return this.http.get<User>(`${this.baseUrl}/user/get.php?api_key=${this.apiKey}&id=${id}`).toPromise();
  }

  updateUser(user: object | any): Promise<any> {
    let data = `id=${user.id}&email=${user.email}&surname=${user.surname}&name=${user.name}&middlename=${user.middlename}
    &tel=${user.tel}&std_group=${user.std_group}&avatar=${user.avatar}&description=${user.description}`;
    if (user.pass.length > 5 && user.old_pass.length > 5) {
      data += `&pass=${user.pass}&old_pass=${user.old_pass}`;
    }
    return this.http.post(`${this.baseUrl}/user/update.php`, data, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      observe: 'response'
    }).toPromise();
  }

  /*
  ** PROJECTS
   */
  getProjectsByStatus(status: number, perPage: number, page: number): Promise<Projects> {
    return this.http.get<Projects>(
        `${this.baseUrl}/projects/get.php?status=${status}&per_page=${perPage}&page=${page}`).toPromise();
  }

  getProjectsByStatusAndCurator(status: number, curator: number | string, perPage: number, page: number): Promise<Projects> {
    return this.http.get<Projects>(
        `${this.baseUrl}/projects/get.php?status=${status}&curator=${curator}&per_page=${perPage}&page=${page}`).toPromise();
  }

  getProjectById(id: number | string): Promise<Project> {
    return this.http.get<Project>(
        `${this.baseUrl}/projects/get.php?id=${id}`).toPromise();
  }

  createProject(form: object | string): Promise<any | object> {
    form = form + '&api_key=' + this.apiKey;
    return this.http.post(`${this.baseUrl}/projects/create.php`, form, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      observe: 'response'
    }).toPromise();
  }

  updateProjectsDeadlines(): Promise<any> {
    return this.http.post(`${this.baseUrl}/projects/updateStatus.php`, `api_key=${this.apiKey}`, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      observe: 'response'
    }).toPromise();
  }

  updateProjectStatus(id: number, status: number, comment: string): Promise<any> {
    const data = `api_key=${this.apiKey}&id=${id}&status=${status}&adm_comment=${comment}`;
    return this.http.post(`${this.baseUrl}/projects/updateProjectStatus.php`, data, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      observe: 'response'
    }).toPromise();
  }

  /*
  ** PROJECTS ARCHIVE
   */
  getArchiveProjects(perPage: number, page: number): Promise<Projects> {
    return this.http.get<Projects>(
        `${this.baseUrl}/projects/getArchive.php?per_page=${perPage}&page=${page}`).toPromise();
  }

  /*
  ** APPLICATIONS
   */
  createApp(worker_id: number, project_id: number, team: number, role: string, comment: string): Promise<any> {
    const data = `worker_id=${worker_id}&project_id=${project_id}&team=${team}&role=${role}&comment=${comment}`;
    return this.http.post(`${this.baseUrl}/applications/create.php`, data, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      observe: 'response'
    }).toPromise();
  }

  getAppsByProjectAndStatus(project_id: number, status: number): Promise<any> {
    return this.http.get(`${this.baseUrl}/applications/get.php?status=${status}&project=${project_id}`, {
      observe: 'response'
    }).toPromise();
  }

  isWorkerRequestedJoin(worker_id: number, project_id: number): Promise<any> {
    return this.http.get(`${this.baseUrl}/applications/get.php?worker=${worker_id}&project=${project_id}`, {
      observe: 'response'
    }).toPromise();
  }

  /*
  ** TAGS
   */
  getTags(): Promise<Tags[]> {
    return this.http.get<Tags[]>(`${this.baseUrl}/tags/get.php`).toPromise();
  }

  getTagsCategories() {

  }

  getTagsValues() {

  }
}
