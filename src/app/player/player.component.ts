import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AlertService, TorrentdlService } from '../_services/index';

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
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private torrentdlService: TorrentdlService) {
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
    this.torrentdlService.torrentdl(this.movie)
      .subscribe(
      data => {
        console.log(data);
        // this.router.navigate(['/player']);
        this.loading = false;
      },
      error => {
        // this.alertService.error(error._body);
        this.loading = false;
      });
  }
}
