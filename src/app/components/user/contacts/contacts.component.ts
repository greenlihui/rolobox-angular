import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Contact } from '../../../models/contact';
import { MatDialog, MatSort, MatTable, MatTableDataSource, Sort } from '@angular/material';
import { GroupDetailDialogComponent, GroupDetailDialogMode } from '../../../popups/group-detail-dialog/group-detail-dialog.coponent';
import { GroupService } from '../../../services/group.service';
import { Group } from '../../../models/group';
import { DeleteDialogComponent } from '../../../popups/delete-dialog/delete-dialog.component';
import { AddContactDialogComponent } from '../../../popups/add-contact-dialog/add-contact-dialog.component';
import { ContactService } from '../../../services/contact.service';
import { forkJoin, of } from 'rxjs';
import { Response } from '../../../models/response';
import { ImageService } from '../../../services/image.service';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ImagePreviewOverlayService } from '../../../popups/image-preview-overlay/image-preview-overlay.service';

enum ViewOption {
  LIST = 'LIST',
  FACE = 'FACE'
}

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  viewOptions = ViewOption;
  viewOption = this.viewOptions.LIST;

  groups: Group[] = [];
  currentGroupId = '';

  contacts: Contact[] = [];
  currentContact: Contact;

  contactOnEdit = false;
  startPanelOpened = true;
  listOnEdit = false;

  @ViewChild('contactList', {static: false}) contactTable: MatTable<any>;
  columnsToDisplay: string[] = ['name', 'company', 'position', 'phone', 'email'];
  selection = new SelectionModel<any>(true, []);
  dataSource: MatTableDataSource<Contact>;
  sort: MatSort;
  @ViewChild(MatSort, {static: false}) set content(content: MatSort) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  readonly customSortingDataAccessor = ((contact, headerId) => {
    switch (headerId) {
      case 'name':
        return contact.name.full;
      case 'company':
        return contact.occupation.company;
      case 'position':
        return contact.occupation.position;
      case 'phone':
        return contact.phones.length && contact.phones[0].number;
      case 'email':
        return contact.emails.length && contact.emails[0].address;
    }
  });

  filterChipsArray: string[] = [];
  filterForm = new FormGroup({
    Gender: new FormGroup({
      Checked: new FormControl(false),
      Value: new FormControl({value: 'Male', disabled: true})
    }),
    AgeRange: new FormGroup({
      Checked: new FormControl(false),
      Value: new FormGroup({
        Low: new FormControl({value: '', disabled: true}),
        High: new FormControl({value: '', disabled: true})
      })
    }),
    Eyeglasses: new FormGroup({
      Checked: new FormControl(false),
      Value: new FormControl({value: true, disabled: true})
    }),
    Mustache: new FormGroup({
      Checked: new FormControl(false),
      Value: new FormControl({value: true, disabled: true})
    }),
    Beard: new FormGroup({
      Checked: new FormControl(false),
      Value: new FormControl({value: true, disabled: true})
    })
  });

  constructor(private _dialog: MatDialog,
              private imagePreviewOverlay: ImagePreviewOverlayService,
              private groupService: GroupService,
              private contactService: ContactService,
              private imageService: ImageService) {
    this.onFilterChange();
    this.initDataForListView();
    this.dataSource = new MatTableDataSource(this.contacts);
    this.dataSource.sortingDataAccessor = this.customSortingDataAccessor;
  }

  ngOnInit() {
  }

  applyFilters() {
    const formattedFilters = this.formatFilters((this.filterForm.value));
    this.contactService.getByFilters(formattedFilters).subscribe(res => {
      this.contacts = res.data;
    });
  }

  onFilterChange() {
    const filterOptions = ['Gender', 'AgeRange', 'Eyeglasses', 'Mustache', 'Beard'];
    filterOptions.forEach(op => {
      const filterControl = this.filterForm.get(op);
      filterControl.get('Checked').valueChanges.subscribe(val => {
        if (val) {
          filterControl.get('Value').enable();
        } else {
          filterControl.get('Value').disable();
        }
      });
    });
    this.filterForm.valueChanges.pipe(
      debounceTime(800),
      distinctUntilChanged(),
      switchMap(formValue => of(formValue))
    ).subscribe(formValue => {
      this.refreshFilterChips(formValue);
    });
  }

  refreshFilterChips(formValue) {
    this.filterChipsArray = [];
    if (formValue.Gender.Checked) {
      const filterString = (formValue.Gender.Value === 'Male') ?
        'Male' : 'Female';
      this.filterChipsArray.push(filterString);
    }
    if (formValue.AgeRange.Checked) {
      const filterString = 'Age ' + formValue.AgeRange.Value.Low
        + ' - ' + formValue.AgeRange.Value.High;
      this.filterChipsArray.push(filterString);
    }
    if (formValue.Eyeglasses.Checked) {
      const filterString = (formValue.Eyeglasses.Value) ?
        'Wearing Eyeglasses' : 'Not Wearing Eyeglasses';
      this.filterChipsArray.push(filterString);
    }
    if (formValue.Mustache.Checked) {
      const filterString = (formValue.Mustache.Value) ?
        'Has Mustache' : 'Does not have Mustache';
      this.filterChipsArray.push(filterString);
    }
    if (formValue.Beard.Checked) {
      const filterString = (formValue.Beard.Calue) ?
        'Has Beard' : 'Does not have Beard';
      this.filterChipsArray.push(filterString);
    }
  }

  formatFilters(filters) {
    const formatted = Object.keys(filters)
      .map(i => {
        const obj = {};
        obj[i] = filters[i];
        return obj;
      }).filter(i => Object.values(i)[0]['Checked'])
      .map(i => {
        const obj = {};
        obj[Object.keys(i)[0]] = Object.values(i)[0]['Value'];
        return obj;
      });
    return formatted;
  }

  initDataForListView() {
    this.groupService.get().subscribe(res => {
      this.groups = res.data;
      if (this.currentGroupId) {
        this.setCurrentGroup(this.currentGroupId);
      } else if (this.groups.length) {
        this.setCurrentGroup(this.groups[0]._id);
      }
    });
  }

  initDataForFaceView() {
    this.contactService.getAll().subscribe(res => {
      this.contacts = res.data;
    });
  }

  moveSelectedTo(group) {
    forkJoin<Response<any>>(
      this.selection.selected.map(contact => {
        const update = contact;
        update.group = group._id;
        return this.contactService.update(update);
      })
    ).subscribe(_ => {
      this.exitEditing();
      this.initDataForListView();
    });
  }

  openImagePreview(filename) {
    this.imagePreviewOverlay.open({
      imageFilename: filename
    });
  }

  deleteSelected() {
    forkJoin<Response<any>>(
      this.selection.selected.map(contact => {
        return this.contactService.deleteById(contact.group, contact._id);
      })
    ).subscribe(_ => {
      this.exitEditing();
      this.initDataForListView();
    });
  }

  openAddContactDialog() {
    const addContactDialog = this._dialog.open(AddContactDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      restoreFocus: false,
      width: '416px',
    });
    addContactDialog.afterClosed().subscribe(contact => {
      if (contact) {
        this.contactService.add(this.currentGroupId, contact).subscribe(res => {
          this.initDataForListView();
        });
      }
    });
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
          for (let i = 0; i < this.contacts.length; i++) {
            if (this.contacts[i]._id === this.currentContact._id) {
              this.contacts.splice(i, 1);
              break;
            }
          }
          this.closeDetail();
          this.initDataForListView();
        });
      }
    });
  }

  openAddGroupDialog() {
    const param = {mode: GroupDetailDialogMode.ADD};
    const addGroupDialog = this._dialog.open(GroupDetailDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      restoreFocus: false,
      data: param
    });
    addGroupDialog.afterClosed().subscribe(group => {
      if (group) {
        this.groupService.add(group).subscribe(res => {
          const saved = res.data;
          saved.numContacts = 0;
          this.groups.push(saved);
          this.setCurrentGroup(res.data._id);
        });
      }
    });
  }

  openEditGroupDialog(edit: Group) {
    const param = {mode: GroupDetailDialogMode.EDIT, group: edit};
    const editGroupDialog = this._dialog.open(GroupDetailDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      restoreFocus: false,
      data: param
    });
    editGroupDialog.afterClosed().subscribe(update => {
      if (update) {
        this.groupService.updateById(edit._id, update).subscribe(res => {
          const updated = res.data;
          for (let i = 0; i < this.groups.length; i++) {
            if (this.groups[i]._id === edit._id) {
              this.groups.splice(i, 1, updated);
              break;
            }
          }
        });
      }
    });
  }

  openDeleteGroupDialog(group) {
    const deleteGroupDialog = this._dialog.open(DeleteDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      restoreFocus: false,
      width: '32%',
      data: 'Delete this group will delete all contacts in it, ' +
        'this action cannot be undone.'
    });
    deleteGroupDialog.afterClosed().subscribe(result => {
      if (result) {
        this.groupService.deleteById(group._id).subscribe(_ => {
          for (let i = 0; i < this.groups.length; i++) {
            if (this.groups[i]._id === group._id) {
              this.groups.splice(i, 1);
              this.setCurrentGroup(this.groups[i - 1]._id);
              break;
            }
          }
        });
      }
    });
  }

  changeViewOption(option: ViewOption) {
    this.viewOption = option;
    if (this.isViewOption(this.viewOptions.LIST)) {
      this.initDataForListView();
    } else {
      this.initDataForFaceView();
      this.filterForm.reset();
    }
  }

  showContactDetail(contact: Contact) {
    this.contactService.getById(this.currentGroupId, contact._id).subscribe(res => {
      this.currentContact = res.data;
      this.startPanelOpened = false;
    });
  }

  enterEditing() {
    this.listOnEdit = true;
    this.columnsToDisplay.unshift('select');
  }

  avatarUrl(thumbnailImageId) {
    if (thumbnailImageId) {
      return this.imageService.generateThumbnailImageURL(thumbnailImageId);
    } else {
      return 'face-m.png';
    }
  }

  exitEditing() {
    this.listOnEdit = false;
    this.columnsToDisplay.shift();
    this.selection.clear();
  }

  startContactEditing() {
    this.contactOnEdit = true;
  }

  completeContactEditing() {
    this.contactOnEdit = false;
    this.contactService.update(this.currentContact).subscribe(_ => {
      if (this.isViewOption(this.viewOptions.LIST)) {
        this.initDataForListView();
      } else {
        this.initDataForFaceView();
      }
    });
  }

  isViewOption(option: ViewOption) {
    return this.viewOption === option;
  }

  loadContacts(groupId) {
    this.contactService.getByGroup(groupId).subscribe(res => {
      this.contacts = res.data;
      this.dataSource.data =  res.data;
    });
  }

  setCurrentGroup(groupId) {
    this.currentGroupId = groupId;
    this.loadContacts(groupId);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.contacts.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.contacts.forEach(row => this.selection.select(row));
  }

  closeDetail() {
    this.startPanelOpened = true;
    this.currentContact = null;
  }
}
