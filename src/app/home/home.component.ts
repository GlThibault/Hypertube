import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../_models/index';
import { UserService, AlertService } from '../_services/index';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html'
})
export class HomeComponent {
  currentUser: User;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private userService: UserService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

}
