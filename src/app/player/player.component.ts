import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AlertService } from '../_services/index';
import { Http, Headers, Response } from '@angular/http';
import { AppConfig } from '../app.config';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})

export class PlayerComponent implements OnInit {
  movie: string;
  source: string;
  website: string;
  loading = false;

  constructor(
    private http: Http,
    private config: AppConfig,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService) {
    if (this.route.snapshot.queryParams['movie'] && this.route.snapshot.queryParams['source'] && !isNaN(this.route.snapshot.queryParams['movie'])) {
      this.movie = this.route.snapshot.queryParams['movie'];
      this.website = this.route.snapshot.queryParams['source'];
    }
  }

  ngOnInit() {
    if (this.movie && this.website) {
      this.loading = true;
      this.http.post(this.config.apiUrl + '/torrentdl', { torrentdl: this.movie, website: this.website })
        .subscribe(
        data => {
          if (data.text() === 'Error')
            this.alertService.error("No video found.");
          else
            this.source = data.text();
          this.loading = false;
        },
        error => {
          this.alertService.error("No video found.");
          this.loading = false;
        });
    } else
      this.router.navigate(['/']);
  }
}
