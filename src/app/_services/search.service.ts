import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { AppConfig } from '../app.config';

@Injectable()
export class SearchService {

  constructor(private http: Http, private config: AppConfig) { }

  research(searchquery: string) {
    return this.http.post(this.config.apiUrl + '/search', { searchquery: searchquery })
      .map((response: Response) => {
        let result = response.json();
        if (result)
          localStorage.setItem('searchresult', JSON.stringify(result));
      });
  }
}
