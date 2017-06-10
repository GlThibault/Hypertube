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
    private searchService: SearchService) { }

    tri_nom () {
      console.log(this.movies[0]);
    }

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
