import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { AppConfig } from '../app.config';

@Injectable()
export class AuthenticationService {
  constructor(private http: Http, private config: AppConfig) { }

  login(username: string, password: string) {
    return this.http.post(this.config.apiUrl + '/users/authenticate', { username: username, password: password })
      .map((response: Response) => {
        let user = response.json();
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      });
  }

  forgot(username: string) {
    return this.http.post(this.config.apiUrl + '/users/forgot', { username: username });
  }

  logout() {
    localStorage.removeItem('currentUser');
  }
}
