import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html'
})

export class ForgotComponent {
  model: any = {};
  loading = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService) { }

  forgot() {
    this.loading = true;
    this.authenticationService.forgot(this.model.username)
      .subscribe(
      data => {
        this.alertService.success('A new password as been sent', true);
        this.router.navigate(['/login']);
      },
      error => {
        this.alertService.error(error._body);
        this.loading = false;
      });
  }
}
