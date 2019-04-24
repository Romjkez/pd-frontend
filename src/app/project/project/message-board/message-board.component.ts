import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {WebSocketSubject} from 'rxjs/webSocket';
import {parseJwt} from '../../../shared/utils/functions.util';

interface MessageAuthor {
  id: number;
  name: string;
  surname: string;
  middle_name: string;
}

interface ChatMessage {
  author: MessageAuthor;
  message: string;
  created_at: Date;
}

@Component({
  selector: 'app-message-board',
  templateUrl: './message-board.component.html',
  styleUrls: ['./message-board.component.css']
})
export class MessageBoardComponent implements OnInit, AfterViewInit {
  messages: ChatMessage[];
  websocket: WebSocketSubject<any>;
  baseUrl = 'localhost:8080/api/chat';
  input: string;
  selfId: number;
  @ViewChild('messagesContainer') messagesContainer: ElementRef<HTMLDivElement>;

  constructor() {
  }

  ngOnInit() {
    this.selfId = parseJwt(localStorage.getItem('token')).data.id;
    this.messages = [
      {
        author: {id: 2, name: 'Роман', surname: 'Петров', middle_name: ''},
        message: 'Привет всем. Как ваши дела, я скучаю мои работники хочу вас всех видеть очень скоро то есть 23 мая на встрече',
        created_at: new Date(2019, 4, 1)
      },
      {
        author: {id: 1, name: 'Карл', surname: 'Новос', middle_name: ''},
        message: 'Приветик я не смогу(',
        created_at: new Date(2019, 4, 3)
      },
      {
        author: {id: 5, name: 'Иван', surname: 'Геров', middle_name: 'Петрович'},
        message: 'Привет! какое время? а?',
        created_at: new Date(2019, 4, 5)
      },
      {
        author: {id: 2, name: 'Роман', surname: 'Петров', middle_name: ''},
        message: 'Привет! какое время? а?',
        created_at: new Date(2019, 4, 23)
      },
    ];
    this.websocket = new WebSocketSubject(this.baseUrl);
  }

  ngAfterViewInit(): void {
    this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
  }

}
