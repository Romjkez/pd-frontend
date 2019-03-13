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
    await this.apiService.getUserById(parseJwt(this.authService.getToken()).data.id).then(res => {
      this.user = res;
      this.regForm = new FormGroup({
        name: new FormControl(this.user.name),
        surname: new FormControl(this.user.surname, [Validators.required]),
        middlename: new FormControl(this.user.middle_name),
        usergroup: new FormControl(parseJwt(localStorage.getItem('token')).data.usergroup, [Validators.required]),
        email: new FormControl(this.user.email, [Validators.required]),
        pass: new FormControl('', [Validators.required, Validators.minLength(6)]),
        pass_repeat: new FormControl('', [Validators.required]),
        tel: new FormControl(this.user.phone),
        std_group: new FormControl(this.user.stdgroup),
        avatar: new FormControl(this.user.avatar),
        description: new FormControl(this.user.description)
      });
      this.loading = false;
    }).catch(e => {
      console.error(e);
      this.snackBar.open('Не удалось получить информацию о пользователе', 'Закрыть', {duration: 5000});
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
      password: 'Новый пароль',
      repeatPassword: 'Повторите пароль',
      tel: 'Ваш телефон',
    };
  }

}
