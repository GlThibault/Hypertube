import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Movie } from '../_models/movie';
import { SearchService } from '../_services/index';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  movies: Movie[] = [];
  title = "Library";
  loading = false;

  constructor(
    private router: Router,
    private searchService: SearchService) {
    this.movies = JSON.parse(localStorage.getItem('topresult'));
  }

  ngOnInit() {
    if (!this.movies) {
      this.loading = true;
      this.searchService.researchtop()
        .subscribe(
        data => {
          this.router.navigateByUrl(`/index`).then(() => this.router.navigateByUrl(`/library`));
        });
    } else {
      localStorage.removeItem('topresult');
    }
  }

}
