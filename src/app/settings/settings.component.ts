import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, UserService } from '../_services/index';
import { User } from '../_models/index';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})

export class SettingsComponent {
  model: any = {};
  currentUser: User;
  loading = false;
  language = [
    { id: 1, name: "English" },
    { id: 2, name: "Français" }
  ];

  constructor(
    private router: Router,
    private alertService: AlertService,
    private userService: UserService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  settings() {
    this.loading = true;
    this.userService.update(this.currentUser, this.model)
      .subscribe(
      data => {
        this.alertService.success('Profile edited', true);
        this.router.navigate(['/settings']);
        this.loading = false;
      },
      error => {
        this.alertService.error(error._body);
        this.loading = false;
      });
  }
}
