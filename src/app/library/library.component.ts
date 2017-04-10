import { Component } from '@angular/core';

import { Movie } from '../_models/movie';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html'
})
export class LibraryComponent {
  movies: Movie[] = [];

  constructor() {
    this.movies = JSON.parse(localStorage.getItem('searchresult'));
  }

}
