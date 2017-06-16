import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Movie } from '../_models/movie';
import { SearchService, TriService } from '../_services/index';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['../library/library.component.css']
})


export class SearchComponent {
  movies = [];
  loading = false;
  page = 0;
  bar = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService,
    private triService: TriService) {
    if (this.route.snapshot.queryParams['search'])
      this.research();
    else
      this.router.navigate(['/']);
  }

  research() {
    this.loading = true;
    this.searchService.research(this.route.snapshot.queryParams['search'], this.page)
      .subscribe(
      data => {
        this.loading = false;
        if (data.err != "Error") {
          this.movies = this.movies.concat(data);
          if (document.body.scrollHeight - 64 > document.body.clientHeight) {
            this.page += 1;
            this.research();
          }
        } else if (document.body.scrollHeight - 64 > document.body.clientHeight && this.page < 10) {
          this.page += 1;
          this.research();
        }
      });
  }

  changeStyle($event) {
    $event.type === 'mouseover' ? this.bar = true : this.bar = false;
  }

  @HostListener('window:scroll', ['$event']) onScrollEvent($event) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.page += 1;
      this.research();
    }
  }

  tri_nom() { this.triService.triName(this.movies); }

  tri_note() { this.triService.triNote(this.movies); }

  tri_annee() { this.triService.triAnnee(this.movies); }

  genre_animation() { this.triService.genre(this.movies, "Animation"); }

  genre_action() { this.triService.genre(this.movies, "Action"); }

  genre_adventure() { this.triService.genre(this.movies, "Adventure"); }

  genre_comedy() { this.triService.genre(this.movies, "Comedy"); }

  genre_crime() { this.triService.genre(this.movies, "Crime"); }

  genre_drama() { this.triService.genre(this.movies, "Drama"); }

  genre_fantasy() { this.triService.genre(this.movies, "Fantasy"); }

  genre_romance() { this.triService.genre(this.movies, "Romance"); }

  genre_thriller() { this.triService.genre(this.movies, "Thriller"); }

  genre_horror() { this.triService.genre(this.movies, "Horror"); }
}
