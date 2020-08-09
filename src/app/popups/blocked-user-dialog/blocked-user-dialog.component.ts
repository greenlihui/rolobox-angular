import { Component } from '@angular/core';
import { User } from '../../models/user';
import { FriendshipService } from '../../services/friendship.service';
import { ImageService } from '../../services/image.service';


@Component({
  template: `<h2 mat-dialog-title>Black List</h2>
  <mat-dialog-content>
    <div style="padding: 8px 0; height: 240px">
      <div class="d-flex align-items-center"
           style="height: 72px; padding: 0 16px; margin-top: 8px"
           *ngFor="let user of blocked">
        <div style="height: 56px; width: 56px; border-radius: 4px; background-size: cover;"
             [style.background-image]="'url(' + imageService.generateThumbnailImageURL(user.profile.faces.avatar) + ')'"></div>
        <div class="fx-auto d-flex fx-column justify-content-around" style="padding-left: 8px">
          <div>{{user.profile.name.full}} ({{user.email}})</div>
          <div class="d-flex justify-content-end">
            <button mat-flat-button color="accent" (click)="unblock(user._id)">UNBLOCK</button>
          </div>
        </div>
      </div>
    </div>
  </mat-dialog-content>`,
})
export class BlockedUserDialogComponent {
  blocked: User[];
  constructor(private fsService: FriendshipService,
              private imageService: ImageService) {
    this.initBlocked();
  }

  initBlocked() {
    this.fsService.getBlocked().subscribe(res => {
      this.blocked = res.data;
    });
  }

  unblock(blockUserId) {
    this.fsService.unblock(blockUserId).subscribe(_ => {
      this.initBlocked();
    });
  }
}
