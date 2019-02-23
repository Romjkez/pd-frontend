import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from '@angular/router';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';

interface FormLabels {
  worker: {
    surname: string,
    std_group: string,
    description: string,
    avatar: string
  };
  curator: {
    surname: string,
    middlename: string,
    description: string,
    avatar: string
  };
  name: string;
  middlename: string;
  email: string;
  password: string;
  repeatPassword: string;
  tel: string;
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  regForm: FormGroup;
  formLabels: FormLabels;

  constructor(private authService: AuthService, private router: Router, private http: HttpClient, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    if (this.authService.isAuthorized()) {
      this.router.navigate(['/']);
    }
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
  }

  async register(): Promise<any> {
    if (this.regForm.controls.pass.value === this.regForm.controls.pass_repeat.value) {
      if (this.regForm.controls.usergroup.value === 1) {
        if (this.regForm.controls.name.value.trim().length !== 0) {
          await this.requestRegister().then((res: HttpResponse<any>) => {
              if (res.body.message === 'true') {
                this.snackBar.open('Поздравляем с регистрацией. Теперь можно авторизоваться', 'Понятно', {duration: 4500});
                this.router.navigate(['/login']);
              }
            }
          ).catch((e: HttpErrorResponse) => {
            this.snackBar.open('Ошибка при регистрации: ' + e.error.message, 'Закрыть', {duration: 3500});
            console.log(e);
          });
        }
      } else {
        await this.requestRegister().then((res) => {
          if (res.body.message === 'true') {
            this.snackBar.open('Поздравляем с регистрацией. Теперь можно авторизоваться', 'Понятно', {duration: 4500});
            this.router.navigate(['/login']);
          }
        });
      }
    } else {
      this.snackBar.open('Введённые пароли не совпадают', 'Закрыть', {
        duration: 2500
      });
      this.regForm.setErrors(Validators.nullValidator);
    }
  }

  resetForm(): void {
    this.regForm = new FormGroup({
      name: new FormControl(''),
      surname: new FormControl('', [Validators.required]),
      middlename: new FormControl(''),
      usergroup: new FormControl(null, [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      pass: new FormControl('', [Validators.required, Validators.minLength(6)]),
      pass_repeat: new FormControl('', [Validators.required]),
      tel: new FormControl(''),
      std_group: new FormControl(''),
      avatar: new FormControl(''),
      description: new FormControl('')
    });
  }

  async requestRegister(): Promise<any> {
    const headers = new HttpHeaders('Content-Type: application/x-www-form-urlencoded');
    const body = 'name=' + this.regForm.controls.name.value.trim() +
      '&surname=' + this.regForm.controls.surname.value.trim() +
      '&middlename=' + this.regForm.controls.middlename.value.trim() +
      '&usergroup=' + this.regForm.controls.usergroup.value +
      '&email=' + this.regForm.controls.email.value.trim() +
      '&pass=' + this.regForm.controls.pass.value.trim() +
      '&tel=' + this.regForm.controls.tel.value.trim() +
      '&std_group=' + this.regForm.controls.std_group.value.trim() +
      '&avatar=' + this.regForm.controls.avatar.value.trim() +
      '&description=' + this.regForm.controls.description.value.trim() +
      '&api_key=android';
    return this.http.post('http://new.std-247.ist.mospolytech.ru/api/user/add.php', body, {headers, observe: 'response'})
      .toPromise();
  }

  back(): void {
    window.history.back();
  }
}
