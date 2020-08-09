import { OverlayRef } from '@angular/cdk/overlay';
import { InjectionToken } from '@angular/core';

export const IMAGE_PREVIEW_OVERLAY_DATA = new InjectionToken<string>('IMAGE_PREVIEW_OVERLAY_DATA');

export class ImagePreviewOverlayRef {
  constructor(private overlayRef: OverlayRef) {
  }

  close(): void {
    this.overlayRef.dispose();
  }
}
