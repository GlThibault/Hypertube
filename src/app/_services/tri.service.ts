import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';

@Injectable()
export class TriService {

  triName(movies: any) {
    movies.sort((a, b) => {
      return a.title.title.localeCompare(b.title.title);
    })
    console.log(movies);
  }

  triNote(movies: any) {
    movies.sort((a, b) => {
      if (!a.imdb)
        return 1;
      if (!b.imdb)
        return -1;
      return b.imdb.rating - a.imdb.rating;
    })
  }

  triAnnee(movies: any) {
    movies.sort((a, b) => {
      return b.year - a.year;
    })
    console.log(movies)
  }
}
