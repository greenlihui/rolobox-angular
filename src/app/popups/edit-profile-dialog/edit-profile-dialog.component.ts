import { Component, Inject } from '@angular/core';
import { Contact } from '../../models/contact';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  template: `
    <h1 mat-dialog-title>Edit Profile</h1>
    <mat-dialog-content>
      <app-contact-detail [onEdit]="true" [contact]="contact" [groupEditable]="false"></app-contact-detail>
    </mat-dialog-content>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-button [mat-dialog-close]="contact">Save</button>
    </div>`
})
export class EditProfileDialogComponent {
  contact: Contact;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.contact = data;
  }
}
