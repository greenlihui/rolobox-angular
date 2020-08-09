import { FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';

/******************** FORM VALIDATION ********************/
export const passwordMatchValidator: ValidatorFn = (form: FormGroup): ValidationErrors | null => {
  const password = form.get('password');
  const repeatPassword = form.get('repeatPassword');
  return password.value !== repeatPassword.value ? {passwordNotMatch: true} : null;
};

export class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control.dirty && form.hasError('passwordNotMatch');
  }
}

/******************** ANIMATIONS ********************/
// animation of certain input filed hiding and showing
export const expandInOut = trigger('expandInOut', [
  transition(':enter', [
    style({height: 0, opacity: 0}),
    animate('500ms ease-in', style({height: '*', opacity: 1}))
  ]),
  transition(':leave', [
    style({height: '*', opacity: 1}),
    animate('500ms ease-out', style({height: 0, opacity: 0}))
  ])
]);

// animation for the button of alter action between sign in and up
export const rotate = trigger('rotate', [
  state('normal', style({
    transform: 'translateX(50%) rotate(0deg)'
  })),
  state('rotated', style({
    transform: 'translateX(50%) rotate(135deg)'
  })),
  transition('normal => rotated', [
    animate('500ms')
  ]),
  transition('rotated => normal', [
    animate('500ms')
  ])
]);
