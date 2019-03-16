import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService, User} from '../../shared/services/api.service';
import {AuthService, parseJwt} from '../../shared/services/auth.service';
import {MatSnackBar} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormLabels} from '../../auth/register/register.component';
import {HttpResponse} from '@angular/common/http';

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
      // todo сделать имя обязательным для группы 1
      this.user = res;
      this.regForm = new FormGroup({
        name: new FormControl(this.user.name),
        surname: new FormControl(this.user.surname, [Validators.required]),
        middlename: new FormControl(this.user.middle_name),
        usergroup: new FormControl(parseJwt(localStorage.getItem('token')).data.usergroup, [Validators.required]),
        email: new FormControl(this.user.email, [Validators.required, Validators.email]),
        pass: new FormControl('', [Validators.minLength(6)]),
        pass_repeat: new FormControl('', [Validators.minLength(6)]),
        tel: new FormControl(this.user.phone),
        std_group: new FormControl(this.user.stdgroup),
        avatar: new FormControl(this.user.avatar),
        description: new FormControl(this.user.description),
        old_pass: new FormControl('')
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
      old_password: 'Текущий пароль'
    };
  }

  update() {
    const data = this.regForm.getRawValue();
    data.id = parseJwt(this.authService.getToken()).data.id;
    this.apiService.updateUser(data).then((res: HttpResponse<any>) => {
      if (res.status === 202) {
        this.snackBar.open('Профиль успешно обновлён', 'Закрыть', {duration: 3500});
        const id = <string>data.id;
        this.router.navigate(['/user/' + id]);
      } else {
        this.snackBar.open(res.body.message, 'Закрыть', {duration: 5000});
      }
    }).catch(e => {
      console.error(e);
      this.snackBar.open('Не удалось обновить профиль', 'Закрыть', {duration: 5000});
    });
  }

  back(): void {
    window.history.back();
  }

}
