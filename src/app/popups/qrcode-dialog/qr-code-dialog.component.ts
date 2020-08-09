import { Component } from '@angular/core';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-dialog-qrcode',
  template: `<h2 mat-dialog-title>Scan QR Code Below to Add Friend</h2>
  <mat-dialog-content style="display: flex; flex-direction: column; align-items: center">
    <ngx-qrcode
      [elementType]="elementType"
      [value] = "value"
      errorCorrectionLevel = "H">
    </ngx-qrcode>
  </mat-dialog-content>`
})
export class QrCodeDialogComponent {
  elementType = 'url';
  value = '';

  constructor(private stateService: StateService) {
    this.value = 'rolobox:addfriend:' + this.stateService.currentUser.email;
  }
}
