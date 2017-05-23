import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

import { AlertService, UserService } from '../_services/index';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../_models/index';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent {
  model: any = {};
  currentUser: User;
  loading = false;
  loading2 = false;
  language = [
    { id: 1, name: "English" },
    { id: 2, name: "Français" }
  ];
  filesToUpload: Array<File> = [];
  imgSrc = "";

  constructor(
    private http: Http,
    private router: Router,
    private alertService: AlertService,
    private userService: UserService,
    private translate: TranslateService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.imgSrc = this.currentUser.image_url;
  }

  settings() {
    this.loading = true;
    this.userService.update(this.currentUser, this.model)
      .subscribe(
      data => {
        window.location.href = '/settings';
        this.loading = false;
      },
      error => {
        this.alertService.error(error._body);
        this.loading = false;
      });
  }

  trans(lang) {
    if (lang == 'Français')
      this.translate.use('fr');
    else
      this.translate.use('en');
  }

  fileChangeEvent(fileInput: any) {
    this.loading2 = true;
    this.filesToUpload = <Array<File>>fileInput.target.files;
    const formData: any = new FormData();
    const files: Array<File> = this.filesToUpload;

    formData.append("uploads[]", files[0], this.currentUser.username + '_' + files[0]['name']);
    formData.append("user", localStorage.getItem('currentUser'));

    this.http.post('http://localhost:3000/upload', formData)
      .map(files => files.json())
      .subscribe(user => {
        if (user)
          this.imgSrc = 'http://localhost:3000/public/' + this.currentUser.username + '_' + fileInput.target.files[0]['name'];
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.loading2 = false;
      })
  }
}
