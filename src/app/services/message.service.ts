import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { StateService } from './state.service';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app-config';
import { Response } from '../models/response';
import { User } from '../models/user';
import { Message } from '../models/message';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private socket: Socket,
              private http: HttpClient,
              private appConfig: AppConfig,
              private stateService: StateService) {
  }

  receiveMsg() {
    return new Observable<Message>(ob => {
      this.socket.on('receiveMsg', (msg) => {
        ob.next(msg);
      });
    });
  }

  setAllMsgsRead(friendUserId) {
    const userId = this.stateService.currentUser._id;
    const url = `${this.appConfig.API_PREFIX}users/${userId}/friends/${friendUserId}/messages`;
    return this.http.put(url, {
      unread: false
    });
  }

  setMsgRead(msgId) {
    const userId = this.stateService.currentUser._id;
    const url = `${this.appConfig.API_PREFIX}users/${userId}/messages/${msgId}`;
    return this.http.put(url, {
      unread: false
    });
  }

  getFriendsInConversation() {
    const userId = this.stateService.currentUser._id;
    const url = `${this.appConfig.API_PREFIX}users/${userId}/friendsInConversation`;
    return this.http.get<Response<User[]>>(url);
  }

  getLatestMsgData(friendUserId) {
    const userId = this.stateService.currentUser._id;
    const url = `${this.appConfig.API_PREFIX}users/${userId}/friends/${friendUserId}/latestMsgData`;
    return this.http.get(url);
  }

  getMessages(friendUserId) {
    const userId = this.stateService.currentUser._id;
    const url = `${this.appConfig.API_PREFIX}users/${userId}/friends/${friendUserId}/messages`;
    return this.http.get<Response<Message[]>>(url);
  }

  signin() {
    this.socket.emit('signin', this.stateService.currentUser._id);
  }

  sendMsg(msg) {
    this.socket.emit('sendMsg', msg);
  }
}
