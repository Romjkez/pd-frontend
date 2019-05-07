import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Project, Projects, UserProjects} from '../models/project.model';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
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

  getProjectsByTags(tags: string, page: number, per_page: number, status?: number) {
    return this.http
      .get<Projects>(`${this.baseUrl}/projects/get.php?tags=${tags}&page=${page}&per_page=${per_page}&status=${status || ''}`)
      .toPromise();
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
      observe: 'body'
    }).toPromise();
  }

  updateProject(form: object | string): Promise<any> {
    return this.http.put(`${this.baseUrl}/projects/update/?${form}`, '', {
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
}
