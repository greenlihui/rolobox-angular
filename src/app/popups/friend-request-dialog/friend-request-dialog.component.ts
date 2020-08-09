import { Component } from '@angular/core';
import { FriendshipService } from '../../services/friendship.service';
import { MatSnackBar } from '@angular/material';
import { Friendship } from '../../models/friendship';
import { ImageService } from '../../services/image.service';


@Component({
  template: `<h2 mat-dialog-title>Add Friend</h2>
    <mat-dialog-content>
      <div class="d-flex align-items-center justify-content-between"
           style="padding-bottom: 8px; border-bottom: 1px solid gray; position: sticky; top: 0; margin: 0 16px; background-color: white">
        <mat-form-field>
          <input matInput placeholder="Email" [(ngModel)]="emailInput">
        </mat-form-field>
        <button mat-flat-button color="primary"
                (click)="sendFriendRequest();">
          Send Request</button>
      </div>
      <div style="padding: 8px 0; height: 240px">
        <div class="d-flex align-items-center"
             style="height: 72px; padding: 0 16px; margin-top: 8px"
             *ngFor="let request of friendRequests">
          <div style="height: 56px; width: 56px; border-radius: 4px; background-size: cover;"
               [style.background-image]="'url(' + imageService.generateThumbnailImageURL(request.requester.profile.faces.avatar) + ')'"></div>
          <div class="fx-auto d-flex fx-column justify-content-around" style="padding-left: 8px">
            <div>{{request.requester.profile.name.full}} ({{request.requester.email}})</div>
            <div class="d-flex justify-content-around">
              <div>
                <button mat-icon-button color="accent" (click)="approve(request._id)"><mat-icon>done</mat-icon></button>
                <button mat-icon-button color="warn" (click)="delete(request._id)"><mat-icon>close</mat-icon></button>
              </div>
              <button mat-icon-button color="warn" (click)="block(request.requester._id)"><mat-icon>block</mat-icon></button>
            </div>
          </div>
        </div>
      </div>

    </mat-dialog-content>`,
})
export class FriendRequestDialogComponent {
  emailInput = '';
  friendRequests: Friendship[];

  constructor(private fsService: FriendshipService,
              private imageService: ImageService,
              private _snackbar: MatSnackBar) {
    this.initRequests();
  }

  initRequests() {
    this.fsService.getFriendRequests().subscribe(res => {
      this.friendRequests = res.data;
    });
  }

  sendFriendRequest() {
    this.fsService.add(this.emailInput).subscribe(res => {
      this._snackbar.open('Successfully sent', null, {duration: 2000});
      this.emailInput = '';
    });
  }

  approve(rId) {
    this.fsService.approve(rId).subscribe(_ => {
      this.initRequests();
    });
  }

  block(userId) {
    this.fsService.blockUser(userId).subscribe(_ => {
      this.initRequests();
    });
  }

  delete(rId) {
    this.fsService.deleteFriendRequest(rId).subscribe(_ => {
      this.initRequests();
    });
  }
}
