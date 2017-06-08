import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Movie } from '../_models/movie';
import { SearchService } from '../_services/index';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['../library/library.component.css']
})

export class SearchComponent {
  movies: void;
  loading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService) {
    if (this.route.snapshot.queryParams['search']) {
      this.loading = true;
      this.searchService.research(this.route.snapshot.queryParams['search'], 0)
        .subscribe(
        data => {
          this.movies = data;
          this.loading = false;
        });
    } else {
      this.router.navigate(['/']);
    }
  }
}
