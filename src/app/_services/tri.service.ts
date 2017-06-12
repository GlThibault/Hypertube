import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';

@Injectable()
export class TriService {

  triName(movies: any) {
    movies.sort((a, b) => {
      return a.title.title.localeCompare(b.title.title);
    })
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
  }

  genre(movies:any, genre: string){
    for (var i = 0; i < movies.length; i++) {
      movies[i]["afficher"] = "yes";
      if (movies[i].imdb)
      {
        console.log(movies[i].imdb.genres);
        if (movies[i].imdb.genres.indexOf(genre) === -1)
          movies[i]["afficher"] = "no";
      }
      else
        movies[i]["afficher"] = "no";
    }
  }
}
