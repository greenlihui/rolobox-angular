import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { SocketIoConfig } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class AppConfig {
  socketConfig: SocketIoConfig = {
    url: '/',
    options: {}
  };

  private readonly API_VERSION = 'v1';
  readonly API_PREFIX = '/api/' + this.API_VERSION + '/';
  readonly APP_NAME = 'Capstone';

  readonly formEncodedHeader = {
    headers: new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
  };
}
