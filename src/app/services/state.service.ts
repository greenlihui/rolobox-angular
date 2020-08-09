import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app-config';
import { User } from '../models/user';
import { Response } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private _currentUserSource = new BehaviorSubject<User>(undefined);
  $currentUser = this._currentUserSource.asObservable();

  constructor(private http: HttpClient,
              private appConfig: AppConfig) {
  }

  private init(): Observable<Response<User>> {
    const url = this.appConfig.API_PREFIX + 'init';
    return this.http.get<Response<User>>(url);
  }

  initComplete() {
    return new Promise((resolve, reject) => {
      this.init().subscribe(res => {
        this.updateCurrentUser(res.data);
        resolve(res.data);
      }, error => {
        reject(error);
      });
    });
  }

  get currentUser() {
    return this._currentUserSource.getValue();
  }

  updateCurrentUser(user: User) {
    this._currentUserSource.next(user);
  }
}
