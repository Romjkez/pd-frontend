import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ParsedProjectApplication, ParsedWorkerApplication} from '../models/application.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

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
    return this.http
      .get<ParsedProjectApplication>(`${this.baseUrl}/applications/get.php?worker=${userId}&per_page=${per_page}&page=${page}`,
        {observe: 'body'})
      .toPromise();
  }
}
