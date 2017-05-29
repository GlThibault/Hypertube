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
  loading = false;

  constructor(
    private http: Http,
    private config: AppConfig,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService) {
    if (this.route.snapshot.queryParams['movie'] && !isNaN(this.route.snapshot.queryParams['movie']))
      this.movie = this.route.snapshot.queryParams['movie'];
  }

  ngOnInit() {
    if (this.movie)
      this.torrentdl();
    else
      this.router.navigate(['/']);
  }

  torrentdl() {
    this.loading = true;
    this.http.post(this.config.apiUrl + '/torrentdl', { torrentdl: this.movie })
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
  }
}
