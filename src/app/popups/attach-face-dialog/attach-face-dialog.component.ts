import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-attach-face',
  templateUrl: 'attach-face-dialog.component.html'
})
export class AttachFaceDialogComponent implements OnInit {
  contact = new FormControl();
  contacts: any[];
  filteredOptions: Observable<any[]>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.contacts = data.contacts;
  }

  ngOnInit(): void {
    this.filteredOptions = this.contact.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: any): any[] {
    const filterValue = value.toLowerCase();
    return this.contacts.filter(contact => (contact.name.first + ' ' + contact.name.last).toLowerCase().includes(filterValue));
  }

  get contactId() {
    let contactId = '';
    for (const contact of this.contacts) {
      if (contact.name.full === this.contact.value) {
        contactId = contact._id;
        break;
      }
    }
    return contactId;
  }
}
