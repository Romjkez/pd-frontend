import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Project, Projects, UserProjects} from '../models/project.model';
import {User} from '../models/user.model';
import {Tag} from '../models/tags.model';
import {ParsedProjectApplication, ParsedWorkerApplication} from '../models/application.model';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  /*
  ** USER
   */
  registerUser(body: string): Promise<any> {
    const headers = new HttpHeaders('Content-Type: application/x-www-form-urlencoded');
    return this.http.post(`${this.baseUrl}/user/add.php`, body, {headers, observe: 'response'})
      .toPromise();
  }

  authorizeUser(body: string): Promise<any> {
    const headers = new HttpHeaders('Content-Type: application/x-www-form-urlencoded');
    return this.http.post(`${this.baseUrl}/user/auth.php`, body, {headers}).toPromise();
  }

  getUserByEmail(email: string): Promise<User> {
    return this.http.get<User>(`${this.baseUrl}/user/get.php?email=${email}`).toPromise();
  }

  getUserBySurname(surname: string): Promise<User> | Promise<User[]> {
    return this.http.get<User>(`${this.baseUrl}/user/get.php?surname=${surname}`).toPromise();
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

  /*
  ** PROJECTS
   */
  getProjectsByStatus(status: number, perPage: number, page: number, sort?: string): Promise<Projects> {
    return this.http.get<Projects>(
      `${this.baseUrl}/projects/get.php?status=${status}&per_page=${perPage}&page=${page}&sort=${sort || '-id'}`).toPromise();
  }

  getProjectsByStatusAndCurator(status: number, curator: number | string, perPage: number, page: number, sort?: string): Promise<Projects> {
    return this.http.get<Projects>(
      `${this.baseUrl}/projects/get.php?status=${status}&curator=${curator}&per_page=${perPage}&page=${page}&sort=${sort || '-id'}`)
      .toPromise();
  }

  getProjectById(id: number | string): Promise<Project> {
    return this.http.get<Project>(
      `${this.baseUrl}/projects/get.php?id=${id}`).toPromise();
  }

  getUserProjects(id: number): Promise<UserProjects> {
    return this.http.get<UserProjects>(`${this.baseUrl}/projects/get.php?user=${id}`).toPromise();
  }

  createProject(form: object | string): Promise<any> {
    return this.http.post(`${this.baseUrl}/projects/create/`, form, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      observe: 'body'
    }).toPromise();
  }

  updateProjectsDeadlines(): Promise<any> {
    return this.http.post(`${this.baseUrl}/projects/updateStatus.php`, '', {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      observe: 'body'
    }).toPromise();
  }

  updateProjectStatus(id: number, status: number, comment: string): Promise<any> {
    const data = `id=${id}&status=${status}&adm_comment=${comment}`;
    return this.http.post(`${this.baseUrl}/projects/updateProjectStatus.php`, data, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      observe: 'response'
    }).toPromise();
  }

  updateProject(form: object | string): Promise<any> {
    return this.http.post(`${this.baseUrl}/projects/update.php`, form, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      observe: 'body'
    }).toPromise();
  }

  deleteProject(id: number): Promise<any> {
    return this.http.delete(`${this.baseUrl}/projects/delete/?id=${id}`, {observe: 'body'}).toPromise();
  }

  searchProjectByTitle(title: string): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/projects/get.php?title=${title.trim()}`, {observe: 'body'});
  }

  /*
  ** PROJECTS ARCHIVE
   */
  getArchiveProjects(perPage: number, page: number): Promise<Projects> {
    return this.http.get<Projects>(
      `${this.baseUrl}/projects/getArchive.php?per_page=${perPage}&page=${page}`).toPromise();
  }

  getArchiveProjectsByCurator(curator: number | string, perPage: number, page: number): Promise<Projects> {
    return this.http.get<Projects>(
      `${this.baseUrl}/projects/getArchive.php?curator=${curator}&per_page=${perPage}&page=${page}`).toPromise();
  }

  getArchiveProjectById(id: number) {
    return this.http.get<Project>(
      `${this.baseUrl}/projects/getArchive.php?id=${id}`).toPromise();
  }

  /*
  ** APPLICATIONS
   */
  createApp(worker_id: number, project_id: number, team: number, role: string, comment: string): Promise<any> {
    const data = `worker_id=${worker_id}&project_id=${project_id}&team=${team}&role=${role}&comment=${comment}`;
    return this.http.post(`${this.baseUrl}/applications/create.php`, data, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      observe: 'body'
    }).toPromise();
  }

  getAppsByProjectAndStatus(project_id: number, status: number): Promise<any> {
    return this.http.get<ParsedWorkerApplication>(`${this.baseUrl}/applications/get.php?status=${status}&project=${project_id}`,
      {
        observe: 'body'
      }).toPromise();
  }

  isWorkerRequestedJoin(worker_id: number, project_id: number): Promise<any> {
    return this.http.get(`${this.baseUrl}/applications/get.php?workerApplied=${worker_id}&project=${project_id}`, {
      observe: 'body'
    }).toPromise();
  }

  updateApp(appId: number, status: number): Promise<any> {
    const data = `id=${appId}&status=${status}`;
    return this.http.post(`${this.baseUrl}/applications/update.php`, data, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      observe: 'body'
    }).toPromise();
  }

  getUserApps(userId: number, per_page: number, page: number): Promise<any> {
    // tslint:disable-next-line
    return this.http.get<ParsedProjectApplication>(`${this.baseUrl}/applications/get.php?worker=${userId}&per_page=${per_page}&page=${page}`,
      {observe: 'body'})
      .toPromise();
  }

  /*
  ** TAGS
   */
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

  /**
   * FILE
   */
  getProjectFiles(project: number): Promise<any> {
    return this.http.get(`${this.baseUrl}/file/?project_id=${project}`).toPromise();
  }
}
