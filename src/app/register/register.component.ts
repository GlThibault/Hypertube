import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

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
  filesToUpload: Array<File> = [];
  imgSrc = "";

  constructor(
    private http: Http,
    private router: Router,
    private alertService: AlertService,
    private userService: UserService) { }

  register() {
    if (this.imgSrc) {
      this.loading = true;
      this.userService.create(this.model)
        .subscribe(
        data => {
          const formData: any = new FormData();
          const files: Array<File> = this.filesToUpload;

          formData.append("uploads[]", files[0], files[0]['name']);
          formData.append("user", localStorage.getItem('currentUser'));

          this.http.post('http://localhost:3000/upload', formData)
            .map(files => files.json())
            .subscribe(user => {
              if (user)
                localStorage.setItem('currentUser', JSON.stringify(user));
              this.alertService.success('Registration successful', true);
              this.router.navigate(['/login']);
            })
        },
        error => {
          this.alertService.error(error._body);
          this.loading = false;
        });
    }
  }

  fileChangeEvent(fileInput: any) {
    this.imgSrc = 'http://localhost:3000/public/' + fileInput.target.files[0]['name'];
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

}
