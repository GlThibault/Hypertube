import { Component, OnInit } from '@angular/core';
import { Movie } from '../_models/movie';

@Component({
  selector: 'app-search',
  templateUrl: '../library/library.component.html',
  styleUrls: ['../library/library.component.css']
})
export class SearchComponent {
  movies: Movie[] = [];
  loading = false;
  title = "Search Result";

  constructor() {
    this.movies = JSON.parse(localStorage.getItem('searchresult'));
  }

}
