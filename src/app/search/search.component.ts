import { Component, OnInit } from '@angular/core';
import { Movie } from '../_models/movie';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['../library/library.component.css']
})
export class SearchComponent {
  movies: Movie[] = [];
  loading = false;
  title = "Search Result";

  constructor(private translate: TranslateService) {
    this.movies = JSON.parse(localStorage.getItem('searchresult'));
  }

}
