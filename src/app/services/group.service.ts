import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app-config';
import { StateService } from './state.service';
import { Response } from '../models/response';
import { Group } from '../models/group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient,
              private stateService: StateService,
              private appConfig: AppConfig) { }

  add(group) {
    const userId = this.stateService.currentUser._id;
    const url = this.appConfig.API_PREFIX + 'users/' + userId + '/groups';
    return this.http.post<Response<Group>>(url, group);
  }

  get() {
    const userId = this.stateService.currentUser._id;
    const url = this.appConfig.API_PREFIX + 'users/' + userId + '/groups';
    return this.http.get<Response<Group[]>>(url);
  }

  updateById(groupId: string, updated) {
    const userId = this.stateService.currentUser._id;
    const url = this.appConfig.API_PREFIX + 'users/' + userId + '/groups/' + groupId;
    return this.http.put<Response<Group>>(url, updated);
  }

  deleteById(groupId: string) {
    const userId = this.stateService.currentUser._id;
    const url = this.appConfig.API_PREFIX + 'users/' + userId + '/groups/' + groupId;
    return this.http.delete(url);
  }
}
