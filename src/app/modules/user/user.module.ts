import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from '../../components/user/user.component';
import { MessagesComponent } from '../../components/user/messages/messages.component';
import { ContactsComponent } from '../../components/user/contacts/contacts.component';
import { DetectionComponent } from '../../components/user/detection/detection.component';
import { GalleryComponent } from '../../components/user/gallery/gallery.component';
import { SettingsComponent } from '../../components/user/settings/settings.component';
import { SharedModule } from '../shared/shared.module';
import { MatSortModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadInfoDialogComponent } from '../../popups/upload-info-dialog/upload-info-dialog.component';
import { ContactDetailComponent } from '../../components/user/contact-detail/contact-detail.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AddFaceBottomSheetComponent } from '../../popups/add-face-bottom-sheet/add-face-bottom-sheet.component';
import { GroupDetailDialogComponent } from '../../popups/group-detail-dialog/group-detail-dialog.coponent';
import { DeleteDialogComponent } from '../../popups/delete-dialog/delete-dialog.component';
import { AddContactDialogComponent } from '../../popups/add-contact-dialog/add-contact-dialog.component';
import { AttachFaceDialogComponent } from '../../popups/attach-face-dialog/attach-face-dialog.component';
import { ImagePreviewOverlayComponent } from '../../popups/image-preview-overlay/image-preview-overlay.component';
import { ImagePreviewOverlayService } from '../../popups/image-preview-overlay/image-preview-overlay.service';
import { SearchFaceResultDialogComponent } from '../../popups/search-face-result-dialog/search-face-result-dialog.component';
import { DetectionResultComponent } from '../../components/user/detection-result/detection-result.component';
import { FirstSigninDialogComponent } from '../../popups/first-signin-dialog/first-signin-dialog.component';
import { EditProfileDialogComponent } from '../../popups/edit-profile-dialog/edit-profile-dialog.component';
import { FriendRequestDialogComponent } from '../../popups/friend-request-dialog/friend-request-dialog.component';
import { BlockedUserDialogComponent } from '../../popups/blocked-user-dialog/blocked-user-dialog.component';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { QrCodeDialogComponent } from '../../popups/qrcode-dialog/qr-code-dialog.component';

@NgModule({
  declarations: [
    UserComponent,
    MessagesComponent,
    ContactsComponent,
    DetectionComponent,
    GalleryComponent,
    SettingsComponent,
    UploadInfoDialogComponent,
    ContactDetailComponent,
    AddFaceBottomSheetComponent,
    GroupDetailDialogComponent,
    DeleteDialogComponent,
    AddContactDialogComponent,
    AttachFaceDialogComponent,
    ImagePreviewOverlayComponent,
    SearchFaceResultDialogComponent,
    DetectionResultComponent,
    FirstSigninDialogComponent,
    EditProfileDialogComponent,
    FriendRequestDialogComponent,
    BlockedUserDialogComponent,
    QrCodeDialogComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    MatSortModule,
    ReactiveFormsModule,
    ImageCropperModule,
    FormsModule,
    NgxQRCodeModule,
  ],
  entryComponents: [
    UploadInfoDialogComponent,
    AddFaceBottomSheetComponent,
    GroupDetailDialogComponent,
    DeleteDialogComponent,
    AddContactDialogComponent,
    AttachFaceDialogComponent,
    ImagePreviewOverlayComponent,
    SearchFaceResultDialogComponent,
    FirstSigninDialogComponent,
    EditProfileDialogComponent,
    FriendRequestDialogComponent,
    BlockedUserDialogComponent,
    QrCodeDialogComponent
  ],
  providers: [
    ImagePreviewOverlayService
  ]
})
export class UserModule {
}
