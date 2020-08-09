import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { ImageService } from '../../../services/image.service';
import { ContactService } from '../../../services/contact.service';
import { SearchFaceResultDialogComponent } from '../../../popups/search-face-result-dialog/search-face-result-dialog.component';
import { AddFaceBottomSheetComponent } from '../../../popups/add-face-bottom-sheet/add-face-bottom-sheet.component';
import { MatBottomSheet, MatDialog } from '@angular/material';

@Component({
  selector: 'app-detection-result',
  templateUrl: './detection-result.component.html',
  styleUrls: ['./detection-result.component.scss']
})
export class DetectionResultComponent implements OnInit {
  @Input() faceDetails: any[];
  @Input() currentImageFilename: string;

  private _currentFaceIndex;
  @Input() set currentFaceIndex(index) {
    this._currentFaceIndex = index;
    const selected = this.el.nativeElement.querySelector('.face--selected');
    if (selected) {
      selected.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'start'});
    }
  }
  get currentFaceIndex() {
    return this._currentFaceIndex;
  }

  constructor(private imageService: ImageService,
              private contactService: ContactService,
              private el: ElementRef,
              private _dialog: MatDialog,
              private _bottomSheet: MatBottomSheet) { }

  ngOnInit() {
  }

  addFace() {
    const thumbnailImageFilename = this.faceDetails[this.currentFaceIndex].ThumbnailImageFilename;
    this.contactService.searchBySimilarFace(thumbnailImageFilename).subscribe(res => {
      if (res.data.length) {
        const thumbnailURL = this.imageService.generateThumbnailImageURL(thumbnailImageFilename);
        const data = {contacts: res.data, thumbnailImageURL: thumbnailURL};
        this.openSearchFaceResultDialog(data);
      } else {
        this.openAddFaceBottomSheet();
      }
    });
  }

  openSearchFaceResultDialog(dialogData) {
    const thumbnailImageFilename = this.faceDetails[this.currentFaceIndex].ThumbnailImageFilename;
    const searchFaceResultDialog = this._dialog.open(SearchFaceResultDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      width: '368px',
      data: dialogData
    });
    searchFaceResultDialog.afterClosed().subscribe(result => {
      if (result) {
        this.contactService.attachFaceToExistingContact(result, this.currentImageFilename, thumbnailImageFilename).subscribe(_ => {
          console.log('success');
        });
      } else {
        this.openAddFaceBottomSheet();
      }
    });
  }

  openAddFaceBottomSheet() {
    const thumbnailImageFilename = this.faceDetails[this.currentFaceIndex].ThumbnailImageFilename;
    const thumbnailURL = this.imageService.generateThumbnailImageURL(thumbnailImageFilename);
    this._bottomSheet.open(AddFaceBottomSheetComponent, {
      autoFocus: false,
      restoreFocus: false,
      data: {
        thumbnailImageURL: thumbnailURL,
        srcImageId: this.currentImageFilename,
        thumbnailImageFilename: thumbnailImageFilename
      }
    });
  }

  floor(num) {
    return (Math.floor(num * 100) / 100.0);
  }
}
