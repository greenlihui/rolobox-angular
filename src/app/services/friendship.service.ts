import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app-config';
import { StateService } from './state.service';
import { Response } from '../models/response';
import { Friendship } from '../models/friendship';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class FriendshipService {

  constructor(private http: HttpClient,
              private appConfig: AppConfig,
              private stateService: StateService) {
  }

  getFriendRequests() {
    const userId = this.stateService.currentUser._id;
    const url = `${this.appConfig.API_PREFIX}users/${userId}/friend-requests`;
    return this.http.get<Response<Friendship[]>>(url);
  }

  getBlocked() {
    const userId = this.stateService.currentUser._id;
    const url = `${this.appConfig.API_PREFIX}users/${userId}/block`;
    return this.http.get<Response<User[]>>(url);
  }

  getFriends() {
    const userId = this.stateService.currentUser._id;
    const url = `${this.appConfig.API_PREFIX}users/${userId}/friends`;
    return this.http.get<Response<User[]>>(url);
  }

  blockUser(blockUserId) {
    const userId = this.stateService.currentUser._id;
    const url = `${this.appConfig.API_PREFIX}users/${userId}/block`;
    return this.http.post(url, {blockUserId: blockUserId});
  }

  unblock(blockUserId) {
    const userId = this.stateService.currentUser._id;
    const url = `${this.appConfig.API_PREFIX}users/${userId}/block/${blockUserId}`;
    return this.http.delete(url);
  }

  deleteFriend(friendUserId) {
    const userId = this.stateService.currentUser._id;
    const url = `${this.appConfig.API_PREFIX}users/${userId}/friends/${friendUserId}`;
    return this.http.delete(url);
  }

  deleteFriendRequest(rId) {
    const userId = this.stateService.currentUser._id;
    const url = `${this.appConfig.API_PREFIX}users/${userId}/friend-requests/${rId}`;
    return this.http.delete(url);
  }

  approve(rId) {
    const userId = this.stateService.currentUser._id;
    const url = `${this.appConfig.API_PREFIX}users/${userId}/friend-requests/${rId}`;
    return this.http.put(url, null);
  }

  add(recipient) {
    const userId = this.stateService.currentUser._id;
    const url = `${this.appConfig.API_PREFIX}users/${userId}/friend-requests`;
    const body = {
      requester: userId,
      recipient: recipient
    };
    return this.http.post(url, body);
  }
}
