import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppConfig } from '../app-config';
import { Response } from '../models/response';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
              private socket: Socket,
              private stateService: StateService,
              private appConfig: AppConfig) {
  }

  getVerified() {
    return new Observable(ob => {
      this.socket.on('verified', (userId) => {
        ob.next(userId);
      });
    });
  }

  getById(userId) {
    const url = `${this.appConfig.API_PREFIX}users/${userId}`;
    return this.http.get<Response<User>>(url);
  }

  updateById(update) {
    const url = `${this.appConfig.API_PREFIX}users/${update._id}`;
    return this.http.put(url, update);
  }

  sendVerificationEmail() {
    const userId = this.stateService.currentUser._id;
    const url = `${this.appConfig.API_PREFIX}users/${userId}/verif`;
    return this.http.post<Response<any>>(url, null);
  }

  signup(email: string, password: string): Observable<Response<User>> {
    const url = this.appConfig.API_PREFIX + 'signup';
    const params = new HttpParams()
      .set('email', email)
      .set('password', password);
    return this.http.post<Response<User>>(url, params, this.appConfig.formEncodedHeader);
  }

  signin(email: string, password: string): Observable<Response<User>> {
    const url = this.appConfig.API_PREFIX + 'signin';
    const params = new HttpParams()
      .set('email', email)
      .set('password', password);
    return this.http.post<Response<User>>(url, params, this.appConfig.formEncodedHeader);
  }

  reset(email: string): Observable<null> {
    const url = this.appConfig.API_PREFIX + 'reset?email=' + email;
    return this.http.post<null>(url, null);
  }

  signout() {
    const url = this.appConfig.API_PREFIX + 'signout';
    return this.http.post(url, null);
  }
}
