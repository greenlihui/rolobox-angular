import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Contact } from '../../models/contact';
import { ImageService } from '../../services/image.service';


@Component({
  selector: 'app-search-face-dialog',
  templateUrl: './search-face-dialog.component.html',
  styleUrls: ['./search-face-dialog.component.scss']
})
export class SearchFaceResultDialogComponent {
  contacts: Contact[];
  radioGroupInput;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private imageService: ImageService) {
    this.contacts = this.data.contacts;
  }
}
