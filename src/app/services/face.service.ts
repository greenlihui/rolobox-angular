import { Injectable } from '@angular/core';
import { StateService } from './state.service';
import { AppConfig } from '../app-config';
import { Face } from '../models/face';
import { Contact } from '../models/contact';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FaceService {

  constructor(private http: HttpClient,
              private stateService: StateService,
              private appConfig: AppConfig) {
  }

  deleteFace(contact: Contact, face: Face) {
    const userId = this.stateService.currentUser._id;
    const url = `${this.appConfig.API_PREFIX}users/${userId}/groups/${contact.group}/contacts/${contact._id}/faces/${face._id}`;
    return this.http.delete(url);
  }
}
