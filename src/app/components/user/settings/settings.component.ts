import { Component, ElementRef, OnInit } from '@angular/core';
import { StateService } from '../../../services/state.service';
import { MatDialog } from '@angular/material';
import { EditProfileDialogComponent } from '../../../popups/edit-profile-dialog/edit-profile-dialog.component';
import { ContactService } from '../../../services/contact.service';
import { UserService } from '../../../services/user.service';
import { BlockedUserDialogComponent } from '../../../popups/blocked-user-dialog/blocked-user-dialog.component';
import { ImageService } from '../../../services/image.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  emailOnEdit = false;

  constructor(private el: ElementRef,
              private _dialog: MatDialog,
              private imageService: ImageService,
              private contactService: ContactService,
              private userService: UserService,
              private stateService: StateService) {
  }

  ngOnInit() {
  }

  openEditProfileDialog() {
    const editProfileDialog = this._dialog.open(EditProfileDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      restoreFocus: false,
      width: '416px',
      data: this.stateService.currentUser.profile
    });
    editProfileDialog.afterClosed().subscribe(res => {
      if (res) {
        this.contactService.update(res).subscribe(_ => {
          this.userService.getById(this.stateService.currentUser._id).subscribe(res => {
            this.stateService.updateCurrentUser(res.data);
          });
        });
      }
    });
  }

  openBlockedUserDialog() {
    this._dialog.open(BlockedUserDialogComponent, {
      hasBackdrop: true,
      disableClose: false,
      restoreFocus: false,
      width: '416px',
    });
  }

  showSettingItem(index) {
    const ele = this.el.nativeElement.getElementsByClassName('section__title')[index];
    ele.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'start'});
  }

}
