import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CrossFieldErrorMatcher, expandInOut, passwordMatchValidator, rotate } from './signin.configs';
import { UserService } from '../../../services/user.service';
import { StateService } from '../../../services/state.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { MessageService } from '../../../services/message.service';

enum Action {
  SIGNIN = 'SIGNIN',
  SIGNUP = 'SIGNUP',
  RESET = 'RESET'
}

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  animations: [
    expandInOut,
    rotate
  ]
})
export class SigninComponent implements OnInit {
  actionTypes = Action; // reference to enum so that it can be used in html template
  action: Action = Action.SIGNIN;

  form = this.createForm(this.action);
  errorMatcher = new CrossFieldErrorMatcher();

  constructor(private fb: FormBuilder,
              private soc: MessageService,
              private userService: UserService,
              private stateService: StateService,
              private _snackBar: MatSnackBar,
              private router: Router) {
    this.stateService.initComplete().then(user => {
      this.soc.signin();
      let url = '';
      if (user) {
        url = '/user';
      } else {
        url = '/index';
      }
      router.navigateByUrl(url);
    }).catch(err => {
      router.navigateByUrl('/index');
    });
  }

  ngOnInit() {
  }

  submit() {
    switch (this.action) {
      case Action.SIGNIN:
        this.signin();
        break;
      case Action.SIGNUP:
        this.signup();
        break;
      case Action.RESET:
        this.reset();
        break;
    }
  }

  signin() {
    this.userService.signin(this.email.value, this.password.value).subscribe(res => {
      this.stateService.updateCurrentUser(res.data);
      this.soc.signin();
      this.router.navigateByUrl('/user');
    }, error => {
      if (error.status === 400) {
        this.password.setErrors({wrongPassword: true});
      }
    });
  }

  signup() {
    this.userService.signup(this.email.value, this.password.value).subscribe(res => {
      this.changeAction(this.actionTypes.SIGNIN);
      this._snackBar.open('Successfully signed up!', undefined, {
        duration: 2000
      });
    }, error => {
      if (error.status === 400) {
        this.email.setErrors({sameEmailConflicts: true});
      }
    });
  }

  reset() {
    this.userService.reset(this.email.value).subscribe(res => {
      this._snackBar.open('If the email you provide is correct, you should receive a email, ' +
        'please follow the instruction in it to reset your password.', null, {duration: 5000});
    });
  }

  createForm(action: Action) {
    switch (action) {
      case Action.SIGNIN:
        return this.fb.group({
          email: ['', [Validators.required, Validators.email]],
          password: ['', Validators.required]
        });
      case Action.SIGNUP:
        return this.fb.group({
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required]],
          repeatPassword: ['']
        }, {validators: passwordMatchValidator});
      case Action.RESET:
        return this.fb.group({
          email: ['', [Validators.required, Validators.email]]
        });
    }
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  getEmailError() {
    return this.email.hasError('required') ? 'You must enter an email.' :
      this.email.hasError('email') ? 'Not a valid email.' :
      this.email.hasError('sameEmailConflicts') ? 'Account with same email already exists.' : '';
  }

  // todo password format: numbers, lower and upper case, special characters
  getPasswordError() {
    return this.password.hasError('required') ? 'You must enter a password.' :
      this.password.hasError('wrongPassword') ? 'Username or password is incorrect.' : '';
  }

  changeAction(action: Action) {
    this.action = action;
    this.form = this.createForm(action);
  }

  changeBetweenSignInAndUp() {
    if (this.action === Action.SIGNIN) {
      this.changeAction(Action.SIGNUP);
    } else {
      this.changeAction(Action.SIGNIN);
    }
  }
}
