import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';

export enum GroupDetailDialogMode {
  ADD = 'ADD',
  EDIT = 'EDIT'
}

@Component({
  selector: 'app-dialog-group-detail',
  template: `<h1 mat-dialog-title>{{isDialogMode(dialogModes.ADD) ? 'Create' : 'Edit'}} Group</h1>
    <mat-dialog-content>
      <div>
        <mat-form-field>
          <input [formControl]="name" matInput placeholder="GroupName" required>
          <mat-error *ngIf="false">Same Group Name Already Exists</mat-error>
        </mat-form-field>
      </div>
      <div>
        <mat-form-field>
          <input [formControl]="color" matInput placeholder="Color Label"
                 type="color">
        </mat-form-field>
      </div>
    </mat-dialog-content>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close="">Cancel</button>
      <button mat-button [mat-dialog-close]="group.value">{{isDialogMode(dialogModes.ADD) ? 'Create' : 'Confirm'}}</button>
    </div>`
})
export class GroupDetailDialogComponent {
  mode: GroupDetailDialogMode;
  dialogModes = GroupDetailDialogMode;

  name = new FormControl();
  color = new FormControl();

  group = new FormGroup({
    name: this.name,
    color: this.color
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.mode = data.mode;
    if (data.mode === GroupDetailDialogMode.ADD) {
      this.name.setValue('');
      this.color.setValue('#009688');
    } else {
      this.name.setValue(data.group.name);
      this.color.setValue(data.group.color);
    }
  }

  isDialogMode(mode: GroupDetailDialogMode) {
    return this.mode === mode;
  }
}
