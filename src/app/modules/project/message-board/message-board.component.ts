import {Component, ElementRef, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {catchError, filter, tap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {MatSnackBar} from '@angular/material';
import {AuthService} from '../../shared/services/auth.service';
import {parseJwt} from '../../shared/utils/functions.util';
import {ChatService} from '../../shared/services/chat.service';

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
  messages: ChatMessage[] = [];
  input = '';
  editingMessage: number;
  selfId: number = parseJwt(localStorage.getItem('token')).data.id;
  projectId = +this.activatedRoute.snapshot.paramMap.get('id');
  @Input() isAvailable: boolean;

  @ViewChild('messagesContainer') messagesContainer: ElementRef<HTMLDivElement>;
  @ViewChild('confirmDeletionDialog') confirmDeletionDialog: TemplateRef<any>;

  constructor(private chatService: ChatService, private activatedRoute: ActivatedRoute, private snackBar: MatSnackBar,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    if (this.isAvailable) {
      this.getMessages();
    }
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
              return of(this.snackBar.open(`Ошибка: ${e.error.message}`, 'Закрыть', {duration: 5000}));
            } else {
              return of(this.snackBar.open(`Ошибка при отправке сообщения: ${e.error.message || 'отсутствует интернет-соединение'}`,
                'Закрыть'));
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
              return of(this.snackBar.open(`Ошибка: ${e.error.message}`, 'Закрыть', {duration: 5000}));
            } else {
              return of(this.snackBar.open(`Ошибка при получении сообщений: ${e.error.message || 'отсутствует интернет-соединение'}`,
                'Закрыть'));
            }
          }
        ))
      .subscribe();
  }

  deleteMessage(messageId: number): void {
    this.chatService.deleteMessage(messageId)
      .pipe(
        filter(res => res.message === 'true'),
        tap(() => this.messages.map(
          (val, i) => +val.message_id === +messageId ? this.messages.splice(i, 1) : '')),
        tap(() => this.snackBar.open('Сообщение успешно удалено', 'Закрыть', {duration: 3000})),
        catchError(e => {
            if (e.status === 401) {
              this.authService.logout();
              return of(this.snackBar.open(`Ошибка: ${e.error.message}`, 'Закрыть', {duration: 5000}));
            } else {
              return of(this.snackBar.open(`Ошибка при удалении сообщения: ${e.error.message || 'отсутствует интернет-соединение'}`,
                'Закрыть'));
            }
          }
        ))
      .subscribe();
  }

  editMessage(message: ChatMessage): void {
    if (this.editingMessage) {
      this.editingMessage = undefined;
      this.input = '';
    } else {
      this.input = message.message;
      this.editingMessage = message.message_id;
    }

  }

  confirmMessageEdit(): void {
    this.chatService.editMessage(this.editingMessage, this.input)
      .pipe(
        filter(res => res.message === 'true'),
        tap(() => this.messages.map(elem => elem.message_id === this.editingMessage ? elem.message = this.input : false)),
        tap(() => this.editingMessage = undefined),
        tap(() => this.input = ''),
        catchError(e => {
          if (e.status === 401) {
            this.authService.logout();
            return of(this.snackBar.open(`Ошибка: ${e.error.message}`, 'Закрыть', {duration: 5000}));
          } else {
            return of(this.snackBar.open(`Ошибка при редактировании сообщения: ${e.error.message || 'отсутствует интернет-соединение'}`,
              'Закрыть'));
          }
        }))
      .subscribe();
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && event.isTrusted && event.shiftKey === false && this.input.trim().length > 1) {
      this.sendMessage();
    }
  }
}
