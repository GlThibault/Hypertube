import { Component, OnInit } from '@angular/core';
import { Movie } from '../_models/movie';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['../library/library.component.css']
})
export class SearchComponent {
  movies: Movie[] = [];

  constructor() {
    this.movies = JSON.parse(localStorage.getItem('searchresult'));
  }

}
