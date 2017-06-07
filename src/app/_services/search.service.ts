import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { User } from '../_models/index';

import { AppConfig } from '../app.config';

@Injectable()
export class SearchService {
  currentUser: User;
  constructor(private http: Http, private config: AppConfig) {this.currentUser = JSON.parse(localStorage.getItem('currentUser'));}

  research(searchquery: string, page: number) {
    return this.http.post(this.config.apiUrl + '/search', { searchquery: searchquery, page: page })
      .map((response: Response) => {
        let result = response.json();
        if (result) {
          localStorage.setItem('searchresult', JSON.stringify(result));
        }
      });
  }
  researchtop() {
    return this.http.post(this.config.apiUrl + '/search/top', {user: this.currentUser})
      .map((response: Response) => {
        let result = response.json();
        if (result) {
          localStorage.setItem('topresult', JSON.stringify(result));
        }
      });
  }
}
