import { Component, OnInit } from '@angular/core';

import { Movie } from '../_models/movie';
import { SearchService } from '../_services/index';
import { TriService } from '../_services/index';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})

export class LibraryComponent implements OnInit {
  movies: Movie[] = [];
  loading = false;

  constructor(
    private searchService: SearchService,
    private triService: TriService) { }

    tri_nom () { this.triService.triName(this.movies); }

    tri_note () { this.triService.triNote(this.movies); }

    tri_annee () { this.triService.triAnnee(this.movies); }

    genre_animation () { this.triService.genre(this.movies, "Animation"); }

    genre_action () { this.triService.genre(this.movies, "Action"); }

    genre_adventure () { this.triService.genre(this.movies, "Adventure"); }

    genre_comedy () { this.triService.genre(this.movies, "Comedy"); }

    genre_crime () { this.triService.genre(this.movies, "Crime"); }

    genre_drama () { this.triService.genre(this.movies, "Drama"); }

    genre_fantasy () { this.triService.genre(this.movies, "Fantasy"); }

    genre_romance () { this.triService.genre(this.movies, "Romance"); }

    genre_thriller () { this.triService.genre(this.movies, "Thriller"); }

    genre_horror () { this.triService.genre(this.movies, "Horror"); }

  ngOnInit() {
    this.loading = true;
    this.searchService.researchtop()
      .subscribe(
      data => {
        this.movies = data;
        this.loading = false;
      });
  }
}
