import { Component, OnInit } from '@angular/core';
import { StateService } from '../../services/state.service';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-first-signin-dialog',
  templateUrl: './first-signin-dialog.component.html',
  styleUrls: ['./first-signin-dialog.component.scss']
})
export class FirstSigninDialogComponent implements OnInit {
  userVerified: boolean;
  firstName = '';
  lastName = '';

  doneDisabled = true;

  constructor(private stateService: StateService,
              private _snackbar: MatSnackBar,
              private contactService: ContactService,
              private userService: UserService) {
    this.userVerified = this.stateService.currentUser.status.verified;
  }

  ngOnInit() {
    this.userService.getVerified().subscribe(userId => {
      if (this.stateService.currentUser._id === userId) {
        this.userVerified = true;
      }
    });
  }

  updateName() {
    const profile = this.stateService.currentUser.profile;
    console.log(profile);
    this.contactService.update({_id: profile._id, name: {first: this.firstName, last: this.lastName}}).subscribe(res => {
      console.log(res);
    });
  }

  sendVerificationEmail() {
    this.userService.sendVerificationEmail().subscribe(res => {
      this._snackbar.open('Email has been sent', null, {
        duration: 3000
      });
    });
  }

  done() {
    const user = this.stateService.currentUser;
    this.userService.updateById({_id: user._id, status: {verified: true, firstSignedIn: true}}).subscribe(res1 => {
      this.userService.getById(user._id).subscribe(res => {
        this.stateService.updateCurrentUser(res.data);
      });
    });
  }
}
