import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../_services/index';

@Component({
  selector: 'app-logout',
  templateUrl: '../loading.html'
})
export class LogoutComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.authenticationService.logout();
    window.location.href = '/login';
  }

}
