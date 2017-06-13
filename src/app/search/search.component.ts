import { Component, OnInit, HostListener} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Movie } from '../_models/movie';
import { SearchService } from '../_services/index';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['../library/library.component.css']
})


export class SearchComponent {
  movies = [];
  loading = false;
  loading2 = false;
  page = 0;

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
  @HostListener('window:scroll', ['$event']) onScrollEvent($event){
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    this.loading2 = true;
    this.page += 1;
    this.searchService.research(this.route.snapshot.queryParams['search'], this.page)
        .subscribe(
        data => {
          this.movies = this.movies.concat(data);
          this.loading2 = false;
        });
  }
} 
}
