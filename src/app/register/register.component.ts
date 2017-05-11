import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { FileUploader } from 'ng2-file-upload';
import { AlertService, UserService } from '../_services/index';

const URL = '/upload';

@Component({
  moduleId: module.id,
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.css']
})

export class RegisterComponent {
  model: any = {};
  loading = false;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private userService: UserService) { }

  register() {
    this.loading = true;
    this.userService.create(this.model)
      .subscribe(
      data => {
        this.alertService.success('Registration successful', true);
        this.router.navigate(['/login']);
      },
      error => {
        this.alertService.error(error._body);
        this.loading = false;
      });
  }
}
