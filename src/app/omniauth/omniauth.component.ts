import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { AlertService, AuthenticationService } from '../_services/index';

@Component({
  selector: 'app-omniauth',
  template: ''
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
