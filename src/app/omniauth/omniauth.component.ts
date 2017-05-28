import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { AlertService, AuthenticationService } from '../_services/index';

@Component({
  selector: 'app-omniauth',
  templateUrl: '../loading.html'
})
export class OmniauthComponent implements OnInit {
  model: any = {};
  loading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    if (!this.route.snapshot.queryParams['code']) {
      window.location.href = '/';
    } else if (this.route.snapshot.queryParams['source'] === 'fb') {
    this.authenticationService.omniauthfb(this.route.snapshot.queryParams['code'])
      .subscribe(
      data => {
        window.location.href = '/';
      },
      error => {
        this.alertService.error(error._body);
        this.loading = false;
      });
      }
      else if (this.route.snapshot.queryParams['source'] === 'linkedin') {
    this.authenticationService.omniauthlinkedin(this.route.snapshot.queryParams['code'])
      .subscribe(
      data => {
        window.location.href = '/';
      },
      error => {
        this.alertService.error(error._body);
        this.loading = false;
      });
    } else if (this.route.snapshot.queryParams['source'] === 'google') {
    this.authenticationService.omniauthgoogle(this.route.snapshot.queryParams['code'])
      .subscribe(
      data => {
        window.location.href = '/';
      },
      error => {
        this.alertService.error(error._body);
        this.loading = false;
      });
    } else {
    this.authenticationService.omniauth42(this.route.snapshot.queryParams['code'])
      .subscribe(
      data => {
        window.location.href = '/';
      },
      error => {
        this.alertService.error(error._body);
        this.loading = false;
      });
    }
  }
}
