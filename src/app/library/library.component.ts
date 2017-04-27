import { Component } from '@angular/core';

import { Movie } from '../_models/movie';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent {
  movies: Movie[] = [];

  constructor() {
    this.movies = JSON.parse(localStorage.getItem('searchresult'));
    // console.log(this.movies)
  }

}
