import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../shared/services/auth.service';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {back} from '../../shared/utils/functions.util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  back = back;
  @ViewChild('loginButton') loginButton: ElementRef;

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

  async authorize(): Promise<boolean> {
    this.loginButton.nativeElement.setAttribute('disabled', 'true');
    await this.authService.login(this.loginForm.controls.email.value.trim(), this.loginForm.controls.password.value.trim())
      .then((res) => {
        if (typeof res === 'object') {
          this.snackBar.open('Email или пароль неверный. Попробуйте ещё раз', 'Закрыть');
          this.loginForm.setErrors(Validators.required);
          this.loginButton.nativeElement.removeAttribute('disabled');
          return false;
        } else {
          localStorage.setItem('token', res);
          this.authService.authChange.next();
          this.router.navigate(['/']);
          return true;
        }
      })
      .catch((e) => console.log(e));
    return false;
  }
}
