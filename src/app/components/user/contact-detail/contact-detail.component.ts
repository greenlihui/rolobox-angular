import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Contact } from '../../../models/contact';
import { ImageService } from '../../../services/image.service';
import { Group } from '../../../models/group';
import { GroupService } from '../../../services/group.service';
import { ImagePreviewOverlayService } from '../../../popups/image-preview-overlay/image-preview-overlay.service';
import { Face } from '../../../models/face';
import { FaceService } from '../../../services/face.service';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss']
})
export class ContactDetailComponent implements OnInit {
  @Input() onEdit = false;
  @Output() faceClicked = new EventEmitter<string>();
  @Input() groupEditable = true;
  @Input() contact: Contact;
  groups: Group[];

  labelOptions = ['Personal', 'Home', 'Work', 'Mobile', 'School', 'Fax'];
  socialOptions = ['Twitter', 'Facebook', 'Instagram', 'Snapchat', 'Whatsapp', 'Telegram', 'Groupme', 'Hangouts'];

  groupInput = '';
  phoneLabelInput = '';
  phoneNumberInput = '';
  emailLabelInput = '';
  emailAddressInput = '';
  socialPlatformInput = '';
  socialUsernameInput = '';

  _avatarIndex = 0;
  get avatarIndex() {
    return this._avatarIndex;
  }
  set avatarIndex(index) {
    this._avatarIndex = index;
    this.contact.faces.avatar = (this.contact.faces.list[index] as Face).thumbnailImageFilename;
  }

  constructor(private imageService: ImageService,
              private faceService: FaceService,
              private imagePreviewOverlay: ImagePreviewOverlayService,
              private groupService: GroupService) {
  }

  ngOnInit() {
    this.groupService.get().subscribe(res => {
      this.groups = res.data;
      this.groupInput = this.getGroupName(this.contact.group);
    });
  }

  onFaceClicked(faceId) {
    if (this.onEdit) {
      return;
    }
    this.imageService.getByFaceId(faceId).subscribe(res => {
      this.faceClicked.emit(res.data.filename);
    });
  }

  deleteFace(index: number) {
    this.faceService.deleteFace(this.contact, (this.contact.faces.list[index] as Face)).subscribe(res => {
      this.contact.faces.list.splice(index, 1);
      if (this.contact.faces.list.length === 0) {
        this.contact.faces.avatar = 'default-m';
      } else {
        this.avatarIndex = 0;
      }
    });
  }

  previousAvatar() {
    const length = this.contact.faces.list.length;
    const tmpIndex = this.avatarIndex - 1;
    this.avatarIndex = (tmpIndex < 0) ? tmpIndex + length : tmpIndex;
  }

  nextAvatar() {
    const length = this.contact.faces.list.length;
    this.avatarIndex = (this.avatarIndex + 1) % length;
  }

  getGroupName(groupId) {
    let groupName = '';
    for (const group of this.groups) {
      if (group._id === groupId) {
        groupName = group.name;
        break;
      }
    }
    return groupName;
  }

  groupChanged() {
    for (const group of this.groups) {
      if (group.name === this.groupInput) {
        this.contact.group = group._id;
        break;
      }
    }
  }

  formatPhoneNumber(number) {
    const first3 = number.substr(0, 3);
    const middle3 = number.substr(3, 3);
    const last4 = number.substr(6, 4);
    return `(${first3}) ${middle3}-${last4}`;
  }

  addItem(type: string) {
    switch (type) {
      case 'phones':
        this.contact.phones.push({label: this.phoneLabelInput, number: this.phoneNumberInput});
        this.phoneLabelInput = '';
        this.phoneNumberInput = '';
        break;
      case 'emails':
        this.contact.emails.push({label: this.emailLabelInput, address: this.emailAddressInput});
        this.emailLabelInput = '';
        this.emailAddressInput = '';
        break;
      case 'socials':
        this.contact.socials.push({platform: this.socialPlatformInput, username: this.socialUsernameInput});
        this.socialPlatformInput = '';
        this.socialUsernameInput = '';
    }
  }

  deleteItem(type: string, index) {
    this.contact[type].splice(index, 1);
  }

}
