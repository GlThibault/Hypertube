import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';

@Injectable()
export class TriService {
  
  triName(movies: any) {
      movies.sort(function(a,b){
    return a.title.title.localeCompare(b.title.title);
    })
    console.log(movies);
  }

  triNote(movies: any) {
    movies.sort(function(a, b){
    if (!a.imdb)
      return 1;
    if (!b.imdb)
      return -1;
    return b.imdb.rating - a.imdb.rating;
    })
  }

triAnnee(movies: any) {
  var tmp;
  for (var i = 0; i < movies.length - 1; i++) {
    for (var j = 0; j < movies.length - 1; j++) {
      if (!movies[j].imdb)
      {
        movies[j].imdb = {};
        movies[j].imdb.year = 0;
      }
      if (!movies[j + 1].imdb)
      {
        movies[j+1].imdb = {};
        movies[j + 1].imdb.year = 0;
        }
      if (movies[j].imdb.year > movies[j + 1].imdb.year)
      {
        tmp = movies[j];
        movies[j] = movies[j + 1];
        movies[j + 1] = tmp;
      }
    }
  }
}
}
