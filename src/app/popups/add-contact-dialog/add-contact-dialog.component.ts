import { Component, Inject } from '@angular/core';
import { Contact } from '../../models/contact';
import { MAT_DIALOG_DATA } from '@angular/material';


@Component({
  template: `
    <h1 mat-dialog-title>Add Contact</h1>
    <mat-dialog-content>
      <app-contact-detail [onEdit]="true" [contact]="contact"></app-contact-detail>
    </mat-dialog-content>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-button [mat-dialog-close]="contact">Add</button>
    </div>`
})
export class AddContactDialogComponent {
  contact: Contact = {
    name: {
      first: '',
      last: ''
    },
    phones: [],
    emails: [],
    socials: [],
    occupation: {
      company: '',
      position: ''
    },
    faces: {
      avatar: 'default-m',
      list: []
    }
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data) {
      this.contact.faces.avatar = this.data.thumbnailImageFilename;
    }
  }

}
