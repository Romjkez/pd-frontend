import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService, User} from '../../shared/services/api.service';
import {AuthService, parseJwt} from '../../shared/services/auth.service';
import {MatSnackBar} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormLabels} from '../../auth/register/register.component';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  loading: boolean;
  user: User;
  regForm: FormGroup;
  formLabels: FormLabels;

  constructor(private activatedRoute: ActivatedRoute, private apiService: ApiService, private snackBar: MatSnackBar,
              private authService: AuthService, private router: Router) {
  }

  async ngOnInit() {
    if (!this.authService.isAuthorized()) {
      this.router.navigate(['/']);
    }
    this.loading = true;
    this.regForm = new FormGroup({
      name: new FormControl(''),
      surname: new FormControl('', [Validators.required]),
      middlename: new FormControl(''),
      usergroup: new FormControl(1, [Validators.required]),
      email: new FormControl('', [Validators.required]),
      pass: new FormControl('', [Validators.required, Validators.minLength(6)]),
      pass_repeat: new FormControl('', [Validators.required]),
      tel: new FormControl(''),
      std_group: new FormControl(''),
      avatar: new FormControl(''),
      description: new FormControl('')
    });
    this.formLabels = {
      worker: {
        surname: 'Фамилия',
        std_group: 'Учебная группа',
        description: 'О себе',
        avatar: 'Ссылка на фото'
      },
      curator: {
        surname: 'Фамилия/организация',
        middlename: 'Отчество',
        description: 'О себе/компании',
        avatar: 'Ссылка на фото/логотип'
      },
      name: 'Имя',
      middlename: 'Отчество',
      email: 'Email',
      password: 'Пароль',
      repeatPassword: 'Повторите пароль',
      tel: 'Ваш телефон',
    };
    await this.apiService.getUserById(parseJwt(this.authService.getToken()).data.id).then(res => {
      this.user = res;
    }).catch(e => {
      console.error(e);
      this.snackBar.open('Не удалось получить информацию о пользователе', 'Закрыть', {duration: 5000});
    });
  }

}
