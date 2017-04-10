import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';
import { User } from '../_models/index';

@Injectable()
export class UserService {
  constructor(private http: Http, private config: AppConfig) { }

  getAll() {
    return this.http.get(this.config.apiUrl + '/users', this.jwt()).map((response: Response) => response.json());
  }

  getById(_id: string) {
    return this.http.get(this.config.apiUrl + '/users/' + _id, this.jwt()).map((response: Response) => response.json());
  }

  getByName(_id: string) {
    return this.http.get(this.config.apiUrl + '/users/' + _id, this.jwt()).map((response: Response) => response.json());
  }

  create(user: User) {
    return this.http.post(this.config.apiUrl + '/users/register', user, this.jwt());
  }

  update(user: User, password: User) {
    user = Object.assign(user, password);
    return this.http.post(this.config.apiUrl + '/users/' + user._id, user, this.jwt())
      .map((response: Response) => {
        let user = response.json();
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      });
  }

  delete(_id: string) {
    return this.http.delete(this.config.apiUrl + '/users/' + _id, this.jwt());
  }

  private jwt() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
      return new RequestOptions({ headers: headers });
    }
  }
}
