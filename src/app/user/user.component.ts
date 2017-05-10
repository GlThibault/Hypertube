import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User } from '../_models/index';
import { UserService, AlertService } from '../_services/index';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: User;

  constructor(
    private route: ActivatedRoute,
    private alertService: AlertService,
    private userService: UserService) {  }

  ngOnInit() {
    this.userService.getByName(this.route.snapshot.queryParams['name'])
      .subscribe(
      data => {
        this.user = data;
      },
      error => {
        this.alertService.error(error._body);
      });
  }

}
