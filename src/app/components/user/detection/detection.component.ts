import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatBottomSheet, MatDialog, MatSnackBar } from '@angular/material';
import { UploadInfoDialogComponent } from '../../../popups/upload-info-dialog/upload-info-dialog.component';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { ImageService } from '../../../services/image.service';
import { BoundingBox } from '../../../models/image';

enum ImageStatuses {
  NOT_UPLOADED,
  UPLOADED_WITH_FACES_DETECTED,
  UPLOADED_WITH_NO_FACES_DETECTED
}

@Component({
  selector: 'app-detection',
  templateUrl: './detection.component.html',
  styleUrls: ['./detection.component.scss']
})
export class DetectionComponent implements OnInit {
  @ViewChild('imageDisplay', {static: false}) imageDisplay: ElementRef;
  @ViewChild(ImageCropperComponent, {static: false}) imageCropper: ImageCropperComponent;
  imageBase64;
  imageCropAspectRatio = 1;
  imageOriginalAspectRatio = 0;
  imageMaintainAspectRatio = false;
  imageCropperMinSize = 256;
  imageFormat = '';
  imageSize = '';

  imageSrc = '';
  imageElementWidth = 0;
  imageElementHeight = 0;

  boundingBoxes: BoundingBox[] = [];
  faceDetails: any[];
  currentFaceIndex = 0;
  currentImageFilename = '';

  imageOnCropping = false;
  imageEditingDisabled = true;
  barInProgress = false;
  imageStatuses = ImageStatuses;
  imageStatus: ImageStatuses = ImageStatuses.NOT_UPLOADED;

  constructor(private _dialog: MatDialog,
              private _snackbar: MatSnackBar,
              private _bottomSheet: MatBottomSheet,
              private renderer: Renderer2,
              private el: ElementRef,
              private imageService: ImageService) {
  }

  ngOnInit() {
  }

  async upload() {
    this.disableImageEditing();
    this.startLoading();
    const image = await this.imageService.b64toFile(this.imageSrc);
    this.imageService.uploadImage(image).subscribe(res => {
      const filename = res.data.filename;
      this.currentImageFilename = filename;
      this.imageService.detectFaces(filename).subscribe(res2 => {
        this.stopLoading();
        this.faceDetails = res2.data;
        if (this.faceDetails.length) {
          this.changeImageStatus(ImageStatuses.UPLOADED_WITH_FACES_DETECTED);
        } else {
          this.changeImageStatus(ImageStatuses.UPLOADED_WITH_NO_FACES_DETECTED);
        }
        this.generateBoundingBoxes(this.faceDetails);
      });
    });
  }

  async saveACopy() {
    const edited = await this.imageService.b64toFile(this.imageSrc);
    this.imageService.saveFile(edited, 'edited.' + this.imageFormat);
  }

  async compressImage(quality) {
    // determine compress maxsize based on current image size
    let maxSize;
    const estimatedSize = (this.imageSrc.length - 814) / 1.37;
    const imageSizeInMB = (estimatedSize / 1024 / 1024);
    if (imageSizeInMB < 5) {
      maxSize = parseFloat((imageSizeInMB * quality).toFixed(2));
    } else {
      maxSize = (quality === '0.75') ? 4 : 2;
    }
    // start compress
    try {
      this.startLoading();
      const imageFile = await this.imageService.b64toFile(this.imageSrc);
      const compressed = await this.imageService.compress(imageFile, {maxSizeMB: maxSize});
      this.imageSrc = await this.imageService.fileToB64(compressed);
      this.imageSize = this.formatSize((this.imageSrc.length - 814) / 1.37);
    } catch (e) {
      console.log(e);
    }
  }

  reset() {
    this.enableImageEditing();
    this.changeImageStatus(ImageStatuses.NOT_UPLOADED);
    this.faceDetails = null;
    this.boundingBoxes.length = 0;
    this.imageOnCropping = false;
  }

  imageElementLoaded(imgEle) {
    this.stopLoading();
    // set original aspect ratio
    this.imageElementWidth = imgEle.width;
    this.imageElementHeight = imgEle.height;
    this.imageOriginalAspectRatio = imgEle.naturalWidth / imgEle.naturalHeight;
  }

  onFaceBoundsClick(index) {
    this.currentFaceIndex = index;
  }

  loadImageFromLocalFile(event) {
    this.reset();
    const file = event.target.files[0];
    if (file) {
      // base64 encode the image
      this.imageService.fileToB64(file).then(b64 => {
        this.imageSrc = b64;
      });
      this.imageFormat = file.type.substr(6);
      this.imageSize = this.formatSize(file.size);
    }
  }

  async loadImageFromAddress(url: string) {
    this.reset();
    try {
      const blob = await fetch(url).then(res => res.blob());
      if (blob.type.substr(6) === 'png' || blob.type.substr(6) === 'jpeg') {
        this.imageSrc = (await this.imageService.blobToB64(blob)).toString();
      } else {
        this.displayMessage('Invalid URL or Unsupported Image Type');
      }
    } catch (err) {
      console.log('bad behaviors', err);
      this.displayMessage('Invalid URL or Unsupported Image Type');
    }
  }

  setCropAspectRatio(ratio: number) {
    if (ratio === 0) {
      this.imageMaintainAspectRatio = false;
    } else {
      this.imageCropAspectRatio = ratio;
      this.imageMaintainAspectRatio = true;
    }
  }

  imagedLoadFailed() {
    this.stopLoading();
    // todo image load failed
  }

  imageCropped(event: ImageCroppedEvent) {
    /* update image size on image cropped */
    const estimatedFileSize = (event.base64.length - 814) / 1.37;
    this.imageSize = this.formatSize(estimatedFileSize);
  }

  cropperReady() {
    this.stopLoading();
    this.setCropAspectRatio(this.imageOriginalAspectRatio);
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

  formatSize(sizeInBytes: number): string {
    const sizeInMB = sizeInBytes / 1024 / 1024;
    if (sizeInMB < 1) {
      return (sizeInMB * 1024).toFixed(0) + 'KB';
    } else {
      return sizeInMB.toFixed(2) + 'MB';
    }
  }

  isImageStatus(imageStatus: ImageStatuses) {
    return this.imageStatus === imageStatus;
  }

  changeImageStatus(imageStatus: ImageStatuses) {
    this.imageStatus = imageStatus;
  }

  displayMessage(msg: string) {
    this._snackbar.open(msg, '', {
      duration: 3000
    });
  }

  startLoading() {
    this.barInProgress = true;
  }
  stopLoading() {
    this.barInProgress = false;
  }

  disableImageEditing() {
    this.imageEditingDisabled = true;
  }
  enableImageEditing() {
    this.imageEditingDisabled = false;
  }

  startCropping() {
    this.startLoading();
    this.imageOnCropping = true;
    this.imageBase64 = this.imageSrc;
  }
  doneCropping() {
    this.imageOnCropping = false;
    const imageCroppedEvent: any = this.imageCropper.crop();
    this.imageSrc = imageCroppedEvent.base64;
  }
  cancelCropping() {
    this.imageOnCropping = false;
  }

  rotateLeft() {
    this.imageCropper.rotateLeft();
  }

  rotateRight() {
    this.imageCropper.rotateRight();
  }

  flipHorizontal() {
    this.imageCropper.flipHorizontal();
  }

  flipVertical() {
    this.imageCropper.flipVertical();
  }

  openUploadInfoDialog() {
    this._dialog.open(UploadInfoDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      restoreFocus: false
    });
  }
}
