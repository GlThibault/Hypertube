import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../_models/index';
import { UserService, AlertService, TorrentdlService } from '../_services/index';

@Component({
  moduleId: module.id,
  templateUrl: 'home.component.html'
})

export class HomeComponent {
  currentUser: User;
  loading = false;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private torrentdlService: TorrentdlService,
    private userService: UserService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  torrentdl() {
    this.loading = true;
    this.torrentdlService.torrentdl("test")
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
