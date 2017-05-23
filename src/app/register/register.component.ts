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
  img_url = "";
  imgSrc = "";
  picturevalid = false;

  constructor(
    private http: Http,
    private router: Router,
    private alertService: AlertService,
    private userService: UserService) { }

  register() {
    if (this.img_url) {
      this.loading = true;
      this.model.image_url = 'http://localhost:3000/public/' + this.model.username + '_' + this.img_url;
      this.userService.create(this.model)
        .subscribe(
        data => {
          const formData: any = new FormData();
          const files: Array<File> = this.filesToUpload;
          formData.append("uploads[]", files[0], this.model.username + '_' + files[0]['name']);
          this.http.post('http://localhost:3000/upload', formData)
            .subscribe(() => {
              this.alertService.success('Registration successful', true);
              this.router.navigate(['/login']);
            })
        },
        error => {
          this.alertService.error(error._body);
          this.loading = false;
        });
    } else {
      this.picturevalid = true;
    }
  }

  fileChangeEvent(fileInput: any) {
    this.img_url = fileInput.target.files[0]['name'];
    if (fileInput.target.files && fileInput.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (fileInput: any) => {
        this.picturevalid = false;
        this.imgSrc = fileInput.target.result;
      }

      reader.readAsDataURL(fileInput.target.files[0]);
    }
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

}
