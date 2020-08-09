import { Component, OnInit } from '@angular/core';
import { ImagePreviewOverlayService } from '../../../popups/image-preview-overlay/image-preview-overlay.service';
import { ImageService } from '../../../services/image.service';
import { MatDialog } from '@angular/material';
import { DeleteDialogComponent } from '../../../popups/delete-dialog/delete-dialog.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  imagesTimeline: any;
  onEdit = false;

  imageSelection = [];

  constructor(private imagePreviewOverlay: ImagePreviewOverlayService,
              private imageService: ImageService,
              private _dialog: MatDialog) {
    this.initData();
  }

  initData() {
    this.imageService.getAll().subscribe(res => {
      this.imagesTimeline = res.data;
    });
  }

  ngOnInit() {
  }

  openDeleteDialog() {
    const deleteDialog = this._dialog.open(DeleteDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      restoreFocus: false,
      width: '32%',
      data: 'Delete these images will delete all related information ' +
        'including detected faces, this action cannot be undone.'
    });
    deleteDialog.afterClosed().subscribe(result => {
      if (result) {
        forkJoin(
          this.imageSelection.map(image => {
            return this.imageService.deleteByFilename(image);
          })
        ).subscribe(_ => {
          this.clearImageSelection();
          this.initData();
        });
      }
    });
  }

  getMonthName(monthNumber) {
    const months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June',
      'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
    return months[monthNumber - 1];
  }

  openPreview(imageFilename) {
    if (!this.onEdit) {
      this.imagePreviewOverlay.open({
        imageFilename: imageFilename
      });
    }
  }

  enterEditing() {
    this.onEdit = true;
  }

  exitEditing() {
    this.onEdit = false;
  }

  selectionChange(checked, imageFilename) {
    if (checked) {
      this.imageSelection.push(imageFilename);
    } else {
      for (let i = 0; i < this.imageSelection.length; i++) {
        if (this.imageSelection[i] === imageFilename) {
          this.imageSelection.splice(i, 1);
          break;
        }
      }
    }
  }

  clearImageSelection() {
    this.imageSelection = [];
  }

}
