import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpResponse} from '@angular/common/http';
import {FormLabels} from '../../auth/register/register.component';
import {User} from '../../shared/models/user.model';
import {UserService} from '../../shared/services/user.service';
import {AuthService} from '../../shared/services/auth.service';
import {back, parseJwt} from '../../shared/utils/functions.util';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  loading: boolean;
  user: User;
  regForm: FormGroup;
  formLabels: FormLabels;
  back = back;

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private snackBar: MatSnackBar,
              private authService: AuthService, private router: Router) {
  }

  async ngOnInit() {
    if (!this.authService.isAuthorized()) {
      this.router.navigate(['/']);
    }
    this.loading = true;
    await this.userService.getUserById(parseJwt(this.authService.getToken()).data.id).then(res => {
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
    }).catch(e => {
      console.error(e);
      this.snackBar.open(`Ошибка: ${e.error.message || 'отсутствует соединение с интернетом'}`,
        'Закрыть', {duration: 5000});
    }).finally(() => this.loading = false);
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

  update(): void {
    const data = this.regForm.getRawValue();
    data.id = parseJwt(this.authService.getToken()).data.id;
    this.userService.updateUser(data).then((res: HttpResponse<any>) => {
      if (res.status === 202) {
        this.snackBar.open('Профиль успешно обновлён', 'Закрыть', {duration: 3500});
        const id = <string>data.id;
        this.authService.authChange.next();
        this.router.navigate(['/user/' + id]);
      } else {
        this.snackBar.open(res.body.message, 'Закрыть', {duration: 5000});
      }
    }).catch(e => {
      console.error(e);
      this.snackBar.open(`Ошибка при обновлении профиля: ${e.error.message || 'отсутствует соединение с интернетом'}`,
        'Закрыть', {duration: 5000});
    });
  }
}
