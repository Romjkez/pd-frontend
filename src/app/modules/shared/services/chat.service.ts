import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ChatMessage} from '../../project/message-board/message-board.component';
import {environment} from '../../../../environments/environment';

export interface ApiMessage {
  message: string;
  code?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  addMessage(project_id: number, message: string): Observable<ChatMessage> {
    const data = `project_id=${project_id}&message=${message}`;
    const headers = new HttpHeaders().append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post<ChatMessage>(`${this.baseUrl}/chat/`, data, {observe: 'body', headers: headers});
  }

  deleteMessage(messageId: number): Observable<ApiMessage> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/chat/?message_id=${messageId}`, {observe: 'body'});
  }

  getProjectMessages(project_id: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.baseUrl}/chat/?project_id=${project_id}`, {observe: 'body'});
  }
}
