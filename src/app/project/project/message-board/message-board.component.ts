import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ChatService} from '../../../shared/services/chat.service';
import {catchError, filter, tap} from 'rxjs/operators';
import {parseJwt} from '../../../shared/utils/functions.util';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {MatSnackBar} from '@angular/material';
import {AuthService} from '../../../shared/services/auth.service';

export interface MessageAuthor {
  id: number;
  name: string;
  surname: string;
  middle_name: string;
}

export interface ChatMessage {
  message_id: number;
  author: MessageAuthor;
  message: string;
  created_at: Date;
}

@Component({
  selector: 'app-message-board',
  templateUrl: './message-board.component.html',
  styleUrls: ['./message-board.component.css']
})
export class MessageBoardComponent implements OnInit {
  messages: ChatMessage[];
  input = '';
  selfId: number = parseJwt(localStorage.getItem('token')).data.id;
  projectId = +this.activatedRoute.snapshot.paramMap.get('id');

  @ViewChild('messagesContainer') messagesContainer: ElementRef<HTMLDivElement>;
  @ViewChild('confirmDeletionDialog') confirmDeletionDialog: TemplateRef<any>;

  constructor(private chatService: ChatService, private activatedRoute: ActivatedRoute, private snackBar: MatSnackBar,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.getMessages();
  }

  sendMessage(): void {
    this.chatService.addMessage(this.projectId, this.input.trim())
      .pipe(
        filter(res => !!res.message_id),
        tap(newMessage => this.messages.unshift(newMessage)),
        tap(() => this.input = ''),
        catchError(e => {
            if (e.status === 401) {
              this.authService.logout();
              return of(this.snackBar.open(`Ошибка:\n${e.error.message}`, 'Закрыть', {duration: 5000}));
            } else if (e.status !== 403) {
              return of(this.snackBar.open(`Ошибка при отправке сообщения:\n${e.error.message}`, 'Закрыть'));
            }
          }
        ))
      .subscribe();
  }

  getMessages(): void {
    this.chatService.getProjectMessages(this.projectId)
      .pipe(
        filter(response => response.length && response.length > 0),
        tap(messages => this.messages = messages),
        // tap(() => setTimeout(() => this.getMessages(), 10000)),
        catchError(e => {
            if (e.status === 401) {
              this.authService.logout();
              return of(this.snackBar.open(`Ошибка:\n${e.error.message}`, 'Закрыть', {duration: 5000}));
            } else if (e.status !== 403) {
              return of(this.snackBar.open(`Ошибка при получении сообщений:\n${e.error.message}`, 'Закрыть'));
            }
          }
        ))
      .subscribe();
  }

  deleteMessage(messageId: number) {
    this.chatService.deleteMessage(messageId)
      .pipe(
        filter(res => res.message === 'true'),
        tap(() => this.messages.map(
          (val, i) => +val.message_id === +messageId ? this.messages.splice(i, 1) : '')),
        tap(() => this.snackBar.open('Сообщение успешно удалено', 'Закрыть', {duration: 3000})),
        catchError(e => {
            if (e.status === 401) {
              this.authService.logout();
              return of(this.snackBar.open(`Ошибка:\n${e.error.message}`, 'Закрыть', {duration: 5000}));
            } else if (e.status !== 403) {
              return of(this.snackBar.open(`Ошибка при удалении сообщения:\n${e.error.message}`, 'Закрыть'));
            }
          }
        ))
      .subscribe();
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.isTrusted && event.shiftKey === false && this.input.trim().length > 1) {
      this.sendMessage();
    }
  }
}
