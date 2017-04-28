import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { AppConfig } from '../app.config';

@Injectable()
export class TorrentdlService {

  constructor(private http: Http, private config: AppConfig) { }

  torrentdl(torrentdl: string) {
    return this.http.post(this.config.apiUrl + '/torrentdl', { torrentdl: "test" })
      .map((response: Response) => {
        let result = response.json();
        if (result) {
        }
      });
  }
}
