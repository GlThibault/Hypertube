import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Http, Headers, Response } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';

import { AlertService } from '../_services/index';
import { AppConfig } from '../app.config';
import { Movie } from '../_models/movie';
import { User } from '../_models/index';
import { VgAPI } from 'videogular2/core';

import { show } from '../animations';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
  animations: [show]
})

export class PlayerComponent implements OnInit {
  movie: string;
  source: string;
  website: string;
  comment: string;
  loading = false;
  movieInfo: Movie[];
  api: VgAPI;
  currentUser: User;
  ensubtitles: string;
  frsubtitles: string;
  state: string;
  comments: void;

  constructor(
    private http: Http,
    private config: AppConfig,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private translate: TranslateService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.route.snapshot.queryParams['movie'] && this.route.snapshot.queryParams['source']) {
      this.movie = this.route.snapshot.queryParams['movie'];
      this.website = this.route.snapshot.queryParams['source'];
    }
  }

  onPlayerReady(api: VgAPI) {
    this.api = api;
    this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.playVideo.bind(this));
  }

  playVideo() {
    this.api.play();
  }

  onSubmit() {
    this.http.post(this.config.apiUrl + '/comment', { comment: this.comment, user: this.currentUser, magnet: this.movieInfo })
      .subscribe(
      data => {
      });
    this.comment = "";
  }

  showcomment() {
    this.http.post(this.config.apiUrl + '/comment/show', { magnet: this.movieInfo })
      .subscribe(
      data => this.comments = data.json());
  }

  ngOnInit() {
    this.state = 'hidden';
    this.http.post(this.config.apiUrl + '/torrentdl/info', { torrentid: this.movie, source: this.website })
      .subscribe(
      data => {
        let response = data.json();
        if (response[0])
          this.movieInfo = response[0];
        this.ensubtitles = response[0].en;
        this.frsubtitles = response[0].fr;
        this.state = 'revealed';
      });
    if (this.movie && this.website) {
      this.loading = true;
      this.http.post(this.config.apiUrl + '/torrentdl', { torrentid: this.movie, source: this.website, user: this.currentUser })
        .subscribe(
        data => {
          if (data.text() === 'Error') {
            if (this.translate.currentLang == 'fr')
              this.alertService.error('Format de vidéo non compatible.');
            else
              this.alertService.error('Video format not compatible.');
          }
          else {
            this.source = data.text();
          }
          this.loading = false;
        },
        error => {
          if (this.translate.currentLang == 'fr')
            this.alertService.error('Aucune vidéo trouvée.');
          else
            this.alertService.error('No video found.');
          this.loading = false;
        });
    } else
      this.router.navigate(['/']);
  }
}
