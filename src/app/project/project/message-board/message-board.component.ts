import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ChatService} from '../../../shared/services/chat.service';
import {catchError, filter, tap} from 'rxjs/operators';
import {parseJwt} from '../../../shared/utils/functions.util';
import {ActivatedRoute} from '@angular/router';
import {EMPTY, of} from 'rxjs';
import {MatDialog, MatSnackBar} from '@angular/material';

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
  input: string;
  selfId: number = parseJwt(localStorage.getItem('token')).data.id;
  projectId = +this.activatedRoute.snapshot.paramMap.get('id');

  @ViewChild('messagesContainer') messagesContainer: ElementRef<HTMLDivElement>;
  @ViewChild('confirmDeletionDialog') confirmDeletionDialog: TemplateRef<any>;

  constructor(private chatService: ChatService, private activatedRoute: ActivatedRoute, private snackBar: MatSnackBar,
              private dialog: MatDialog) {
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
          this.snackBar.open(`Ошибка при отправке сообщения:\n${e.error.message}`, 'Закрыть');
          return of(console.error(e));
        }))
      .subscribe();
  }

  getMessages(): void {
    this.chatService.getProjectMessages(this.projectId)
      .pipe(
        filter(response => response.length && response.length > 0),
        tap(messages => this.messages = messages),
        // tap(() => setTimeout(() => this.getMessages(), 10000)),
        catchError(e => e.status !== 403 ?
          of(this.snackBar.open(`Ошибка при получении сообщений:\n${e.error.message}`, 'Закрыть')) : EMPTY
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
        catchError(e => of(this.snackBar.open(`Ошибка при удалении сообщения:\n${e.error.message}`, 'Закрыть'))
        ))
      .subscribe();
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.isTrusted) {
      this.sendMessage();
    }
  }
}
