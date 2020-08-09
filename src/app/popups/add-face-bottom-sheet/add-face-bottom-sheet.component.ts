import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatDialog } from '@angular/material';
import { ContactService } from '../../services/contact.service';
import { AttachFaceDialogComponent } from '../attach-face-dialog/attach-face-dialog.component';
import { AddContactDialogComponent } from '../add-contact-dialog/add-contact-dialog.component';
import { StateService } from '../../services/state.service';


@Component({
  selector: 'app-bottom-sheet-add-face',
  template: `
    <mat-nav-list>
      <mat-list-item (click)="openAddContactDialog()">
        <mat-icon mat-list-icon>person_add</mat-icon>
        <span>Create a New Contact</span>
      </mat-list-item>
      <mat-list-item (click)="openAttachFaceDialog()">
        <mat-icon mat-list-icon>create</mat-icon>
        <span>Attach to Existing Contact</span>
      </mat-list-item>
    </mat-nav-list>`
})
export class AddFaceBottomSheetComponent {
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
              private contactService: ContactService,
              private stateService: StateService,
              private _bottomSheet: MatBottomSheet,
              private _dialog: MatDialog) {
  }

  openAddContactDialog() {
    this._bottomSheet.dismiss();
    const addContactDialog = this._dialog.open(AddContactDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      restoreFocus: false,
      width: '416px',
      data: {
        thumbnailImageFilename: this.data.thumbnailImageFilename
      }
    });
    addContactDialog.afterClosed().subscribe(result => {
      if (result) {
        this.contactService.attachFaceToNewlyCreatedContact(result, this.data.srcImageId, this.data.thumbnailImageFilename).subscribe(res => {
          console.log(res); // todo what to do next
        });
      }
    });
  }

  openAttachFaceDialog() {
    this._bottomSheet.dismiss();
    this.contactService.getAll().subscribe(res => {
      const contacts = res.data;
      contacts.push(this.stateService.currentUser.profile);
      const attachFaceDialog = this._dialog.open(AttachFaceDialogComponent, {
        disableClose: true,
        data: {
          contacts: contacts,
          thumbnailImageURL: this.data.thumbnailImageURL
        }
      });
      attachFaceDialog.afterClosed().subscribe(result => {
        if (result) {
          this.contactService.attachFaceToExistingContact(result, this.data.srcImageId, this.data.thumbnailImageFilename).subscribe(resp => {
            console.log(resp); // todo what to do next
          });
        }
      });
    });

  }
}
