import { ComponentRef, Injectable, Injector } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { IMAGE_PREVIEW_OVERLAY_DATA, ImagePreviewOverlayRef } from './image-preview-overlay-ref';
import { ImagePreviewOverlayComponent } from './image-preview-overlay.component';

interface ImagePreviewOverlayConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  imageFilename?: string;
}

const DEFAULT_CONFIG: ImagePreviewOverlayConfig = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
  panelClass: 'image-preview-overlay-panel',
  imageFilename: null,
};


@Injectable()
export class ImagePreviewOverlayService {

  constructor(private overlay: Overlay,
              private injector: Injector) { }

  open(config: ImagePreviewOverlayConfig = {}) {
    const overlayConfig = {...DEFAULT_CONFIG, ...config};
    const overlayRef = this.createOverlay(overlayConfig);
    const imagePreviewOverlayRef = new ImagePreviewOverlayRef(overlayRef);

    const overlayComponent = this.attachOverlayContainer(overlayRef, overlayConfig, imagePreviewOverlayRef);

    overlayRef.backdropClick().subscribe(_ => imagePreviewOverlayRef.close());
    return imagePreviewOverlayRef;
  }

  private createOverlay(config: ImagePreviewOverlayConfig) {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private attachOverlayContainer(overlayRef: OverlayRef, config: ImagePreviewOverlayConfig, imagePreviewOverlayRef: ImagePreviewOverlayRef) {
    const injector = this.createInjector(config, imagePreviewOverlayRef);

    const containerPortal = new ComponentPortal(ImagePreviewOverlayComponent, null, injector);
    const containerRef: ComponentRef<ImagePreviewOverlayComponent> = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private createInjector(config: ImagePreviewOverlayConfig, overlayRef: ImagePreviewOverlayRef): PortalInjector {
    const injectorTokens = new WeakMap();

    injectorTokens.set(ImagePreviewOverlayRef, overlayRef);
    injectorTokens.set(IMAGE_PREVIEW_OVERLAY_DATA, config.imageFilename);

    return new PortalInjector(this.injector, injectorTokens);
  }


  private getOverlayConfig(config: ImagePreviewOverlayConfig): OverlayConfig {
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    return new OverlayConfig({
      width: '80%',
      height: '80%',
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy: positionStrategy
    });
  }
}
