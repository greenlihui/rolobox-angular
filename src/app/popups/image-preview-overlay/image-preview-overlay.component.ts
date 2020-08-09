import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { Contact } from '../../models/contact';
import { IMAGE_PREVIEW_OVERLAY_DATA } from './image-preview-overlay-ref';
import { ImageService } from '../../services/image.service';
import { BoundingBox, Image } from '../../models/image';
import { ContactService } from '../../services/contact.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material';

enum SideContentOptions {
  CONTACTS = 'CONTACTS',
  CONTACT_DETAILS = 'CONTACT_DETAILS',
  FACES_DETAILS = 'FACES_DETAILS'
}

@Component({
  selector: 'app-overlay-image-preview',
  templateUrl: './image-preview-overlay.component.html',
  styleUrls: ['./image-preview-overlay.component.scss']
})
export class ImagePreviewOverlayComponent {
  sideContentOptions = SideContentOptions;
  sideContent = this.sideContentOptions.CONTACTS;

  contacts: Contact[] = [];
  currentContact: Contact;
  contactOnEdit = false;

  imageElementWidth = 0;
  imageElementHeight = 0;
  currentFaceIndex = 0;
  boundingBoxes: BoundingBox[] = [];
  @ViewChild('imageDisplay', {static: false}) imageDisplay: ElementRef;

  imageDoc: Image;
  displayImageFilename = '';
  get imageSrc() {
    return this.imageService.generateImageURL(this.displayImageFilename, 'original');
  }

  constructor(@Inject(IMAGE_PREVIEW_OVERLAY_DATA) public imageFilename: any,
              private _dialog: MatDialog,
              private imageService: ImageService,
              private contactService: ContactService) {
    this.setDisplayImageFilename(imageFilename);
    this.initImage();
    this.initContacts();
  }

  initImage() {
    this.imageService.getImageDoc(this.imageFilename).subscribe(res => {
      this.imageDoc = res.data;
      this.generateBoundingBoxes(this.imageDoc.faceDetails);
    });
  }

  setDisplayImageFilename(filename) {
    this.displayImageFilename = filename;
  }

  initContacts() {
    this.contactService.getByImageFilename(this.imageFilename).subscribe(res => {
      this.contacts = res.data;
    });
  }

  openContactDetail(groupId, contactId) {
    this.changeSideContent(this.sideContentOptions.CONTACT_DETAILS);
    this.contactService.getById(groupId, contactId).subscribe(res => {
      this.currentContact = res.data;
    });
  }

  onFaceBoundsClicked(index) {
    this.currentFaceIndex = index;
  }

  onContactFaceClicked(filename) {
    if (filename !== this.displayImageFilename) {
      this.setDisplayImageFilename(filename);
    }
  }

  goBack() {
    this.setDisplayImageFilename(this.imageFilename);
    this.changeSideContent(this.sideContentOptions.CONTACTS);
  }

  generateBoundingBoxes(faceDetails) {
    const ele = this.imageDisplay.nativeElement;
    const displayWidth = ele.width;
    const displayHeight = ele.height;
    const naturalWidth = ele.naturalWidth;
    const naturalHeight = ele.naturalHeight;
    const scalingRatio = displayWidth / naturalWidth;
    for (const faceDetail of faceDetails) {
      const boundingBox = faceDetail.BoundingBox;
      const offsetLeft = Math.round(displayWidth * boundingBox.Left);
      const offsetTop = Math.round(displayHeight * boundingBox.Top);
      const boundsHeight = Math.round(naturalHeight * boundingBox.Height * scalingRatio);
      const boundsWidth = Math.round(naturalWidth * boundingBox.Width * scalingRatio);
      const box: BoundingBox = new BoundingBox(offsetLeft + 'px',
        offsetTop + 'px',
        boundsWidth + 'px',
        boundsHeight + 'px');
      this.boundingBoxes.push(box);
    }
  }

  imageElementLoaded(imgEle) {
    // set original aspect ratio
    this.imageElementWidth = imgEle.width;
    this.imageElementHeight = imgEle.height;
  }

  isSideContent(sideContent: SideContentOptions) {
    return this.sideContent === sideContent;
  }

  changeSideContent(sideContent: SideContentOptions) {
    this.contactOnEdit = false;
    this.sideContent = sideContent;
    if (sideContent === this.sideContentOptions.CONTACTS) {
      this.initContacts();
    }
  }

  startContactEditing() {
    this.contactOnEdit = true;
  }

  openDeleteContactDialog() {
    const deleteContactDialog = this._dialog.open(DeleteDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      restoreFocus: false,
      width: '32%',
      data: 'Delete this contact will delete all information ' +
        'related to him/her, this action cannot be undone.'
    });
    deleteContactDialog.afterClosed().subscribe(result => {
      if (result) {
        this.contactService.deleteById(this.currentContact.group.toString(), this.currentContact._id).subscribe(_ => {
          this.changeSideContent(this.sideContentOptions.CONTACTS);
        });
      }
    });
  }

  completeContactEditing() {
    this.contactOnEdit = false;
    this.contactService.update(this.currentContact).subscribe(_ => {
      // todo update success
    });
  }
}
