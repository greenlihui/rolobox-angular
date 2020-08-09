import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { StateService } from '../../services/state.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { FirstSigninDialogComponent } from '../../popups/first-signin-dialog/first-signin-dialog.component';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(private userService: UserService,
              private imageService: ImageService,
              private stateService: StateService,
              private _dialog: MatDialog,
              private router: Router) {
  }

  ngOnInit() {
    if (!this.stateService.currentUser.status.firstSignedIn) {
      console.log('first signed in');
      this._dialog.open(FirstSigninDialogComponent, {
        hasBackdrop: true,
        disableClose: true,
        restoreFocus: false,
        width: '416px',
      });
    }
  }

  signout() {
    this.userService.signout().subscribe(_ => {
      this.stateService.updateCurrentUser(null);
      this.router.navigateByUrl('index');
    });
  }
}
