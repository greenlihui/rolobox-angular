import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';


@Component({
  template: `<h2 mat-dialog-title>Are you sure?</h2>
  <mat-dialog-content class="mat-body">
    {{msg}}
  </mat-dialog-content>
  <mat-dialog-actions>
    <button mat-button mat-dialog-close>No</button>
    <button mat-button [mat-dialog-close]="true">Yes</button>
  </mat-dialog-actions>`
})
export class DeleteDialogComponent {
  msg = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.msg = data;
  }
}
