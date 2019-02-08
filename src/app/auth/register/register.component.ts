import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  regForm: FormGroup;
  formLabels: object;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    if (this.authService.isAuthorized()) {
      this.router.navigate(['/']);
    } else {
      this.regForm = new FormGroup({
        name: new FormControl(null),
        surname: new FormControl(null, [Validators.required]),
        middlename: new FormControl(null),
        usergroup: new FormControl(1),
      });
      this.formLabels = {
        worker: {
          surname: 'Фамилия',
          std_group: 'Учебная группа',
          description: 'О себе',
          photo: 'Ссылка на фото'
        },
        curator: {
          surname: 'Фамилия/организация',
          middlename: 'Отчество',
          description: 'О себе/компании',
          photo: 'Ссылка на фото/логотип'
        },
        name: 'Имя',
        middlename: 'Отчество',
        email: 'Email',
        password: 'Пароль',
        repeatPassword: 'Повторите пароль',
        phone: 'Ваш телефон',
      };
    }
  }

  register() {
  }
}
