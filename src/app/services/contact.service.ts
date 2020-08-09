import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StateService } from './state.service';
import { AppConfig } from '../app-config';
import { Contact } from '../models/contact';
import { Response } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient,
              private appConfig: AppConfig,
              private stateService: StateService) {
  }

  getByImageFilename(filename) {
    const userId = this.stateService.currentUser._id;
    const url = `${this.appConfig.API_PREFIX}users/${userId}/images/${filename}/contacts`;
    return this.http.get<Response<Contact[]>>(url);
  }

  getByFilters(filters) {
    const userId = this.stateService.currentUser._id;
    const url = this.appConfig.API_PREFIX + 'users/' + userId + '/queries/filteredContacts';
    return this.http.post<Response<Contact[]>>(url, filters);
  }

  searchBySimilarFace(thumbnailImageFilename) {
    const userId = this.stateService.currentUser._id;
    const url = this.appConfig.API_PREFIX + 'users/' + userId + '/faces/' + thumbnailImageFilename + '/contactsWithSimilarFaces';
    return this.http.get<Response<Contact[]>>(url);
  }

  attachFaceToExistingContact(contactId, srcImageId, thumbnailImageFilename) {
    const userId = this.stateService.currentUser._id;
    const url = this.appConfig.API_PREFIX + 'users/' + userId + '/images/' + srcImageId + '/faces?contactOrigin=EXISTING';
    const body = {thumbnailImageFilename: thumbnailImageFilename, contactId: contactId};
    return this.http.post(url, body);
  }

  attachFaceToNewlyCreatedContact(contact, srcImageId, thumbnailImageFilename) {
    const userId = this.stateService.currentUser._id;
    const url = this.appConfig.API_PREFIX + 'users/' + userId + '/images/' + srcImageId + '/faces?contactOrigin=NEW';
    const body = {thumbnailImageFilename: thumbnailImageFilename, contact: contact};
    return this.http.post(url, body);
  }

  add(groupId: string, contact: Contact) {
    const userId = this.stateService.currentUser._id;
    const url = this.appConfig.API_PREFIX + 'users/' + userId + '/groups/' + groupId + '/contacts';
    return this.http.post<Response<Contact>>(url, contact);
  }

  getAll() {
    const userId = this.stateService.currentUser._id;
    const url = this.appConfig.API_PREFIX + 'users/' + userId + '/contacts';
    return this.http.get<Response<Contact[]>>(url);
  }

  getById(groupId: string, contactId) {
    const userId = this.stateService.currentUser._id;
    const url = this.appConfig.API_PREFIX + 'users/' + userId + '/groups/' + groupId + '/contacts/' + contactId;
    return this.http.get<Response<Contact>>(url);
  }

  deleteById(groupId: string, contactId: string) {
    const userId = this.stateService.currentUser._id;
    const url = this.appConfig.API_PREFIX + 'users/' + userId + '/groups/' + groupId + '/contacts/' + contactId;
    return this.http.delete(url);
  }

  update(updated: Contact) {
    const userId = this.stateService.currentUser._id;
    const url = this.appConfig.API_PREFIX + 'users/' + userId + '/groups/' + updated.group + '/contacts/' + updated._id;
    return this.http.put(url, updated);
  }

  getByGroup(groupId: string) {
    const userId = this.stateService.currentUser._id;
    const url = this.appConfig.API_PREFIX + 'users/' + userId + '/groups/' + groupId + '/contacts';
    return this.http.get<Response<Contact[]>>(url);
  }
}
