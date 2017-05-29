import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './_models/index';
import { UserService, AlertService, SearchService } from './_services/index';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../assets/bootstrap3.css', './app.component.css']
})

export class AppComponent {
  searchquery: any = {}
  loading = false;
  currentUser: User;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private searchService: SearchService,
    private userService: UserService,
    private translate: TranslateService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    translate.addLangs(["en", "fr"]);
    translate.setDefaultLang('en');
    if (!this.translate.currentLang) {
      if (this.currentUser && this.currentUser.language == 'Français')
        this.translate.use('fr');
      else
        this.translate.use('en');
    }
  }

  trans() {
    if (this.translate.currentLang == 'en')
      this.translate.use('fr');
    else
      this.translate.use('en');
  }

  search() {
    this.loading = true;
    this.searchService.research(this.searchquery, 0)
      .subscribe(
      data => {
        if (this.router.url !== '/search')
          this.router.navigate(['/search']);
        else
          this.router.navigateByUrl(`/index`).then(() => this.router.navigateByUrl(`/search`));
        this.loading = false;
      },
      error => {
        this.alertService.error(error._body);
        this.loading = false;
      });
  }
}
