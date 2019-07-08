import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {AuthService} from '../../shared/services/auth.service';
import {back} from '../../shared/utils/functions.util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  back = back;
  @ViewChild('loginButton', {static: false}) loginButton: ElementRef;

  constructor(private authService: AuthService, private snackBar: MatSnackBar, private router: Router) {
  }

  ngOnInit() {
    if (this.authService.isAuthorized()) {
      this.router.navigate(['/']);
    }
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  async authorize() {
    this.loginButton.nativeElement.setAttribute('disabled', 'true');
    await this.authService.login(this.loginForm.controls.email.value.trim(), this.loginForm.controls.password.value.trim())
      .then((res) => {
        if (typeof res === 'object') {
          this.snackBar.open('Email или пароль неверный. Попробуйте ещё раз', 'Закрыть');
          this.loginForm.setErrors(Validators.required);
          this.loginButton.nativeElement.removeAttribute('disabled');
        } else {
          localStorage.setItem('token', res);
          this.authService.authChange.next();
          this.router.navigate(['/']);
        }
      })
      .catch((e) => {
        this.snackBar.open('Ошибка авторизации', 'Закрыть', {duration: 5000});
        console.error(e);
      }).finally(() => this.loginButton.nativeElement.removeAttribute('disabled'));
  }
}
