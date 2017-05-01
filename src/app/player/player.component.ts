import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AlertService, TorrentdlService } from '../_services/index';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html'
})

export class PlayerComponent implements OnInit {
  movie: string;
  loading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private torrentdlService: TorrentdlService) {
    this.movie = this.route.snapshot.queryParams['movie'];
  }

  ngOnInit() { this.torrentdl() }

  torrentdl() {
    this.loading = true;
    this.torrentdlService.torrentdl(this.movie)
      .subscribe(
      data => {
        this.router.navigate(['/player']);
        this.loading = false;
      },
      error => {
        this.alertService.error(error._body);
        this.loading = false;
      });
  }
}
