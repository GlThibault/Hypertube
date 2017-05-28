import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
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

  omniauth42(code: string) {
    return this.http.get(this.config.apiUrl + '/omniauth/42?code=' + code, this.jwt())
      .map((response: Response) => {
        let user = response.json();
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      });
  }

  omniauthfb(code: string) {
    return this.http.get(this.config.apiUrl + '/omniauth/facebook/callback?code=' + code, this.jwt())
      .map((response: Response) => {
        let user = response.json();
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      });
  }

  omniauthgoogle(code: string) {
    return this.http.get(this.config.apiUrl + '/omniauth/google/callback?code=' + code, this.jwt())
      .map((response: Response) => {
        let user = response.json();
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      });
  }

  omniauthlinkedin(code: string) {
    return this.http.get(this.config.apiUrl + '/omniauth/linkedin/callback?code=' + code, this.jwt())
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

  private jwt() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
      return new RequestOptions({ headers: headers });
    }
  }
}
