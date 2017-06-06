import { Component, OnInit } from '@angular/core';
import { Movie } from '../_models/movie';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../_models/index';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['../library/library.component.css']
})
export class SearchComponent {
  movies: Movie[] = [];
  loading = false;
  title = "Search Result";
  currentUser: User;
  
  constructor(private translate: TranslateService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.movies = JSON.parse(localStorage.getItem('searchresult'));
  }

}
