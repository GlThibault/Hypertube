import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './_models/index';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../assets/bootstrap3.css', './app.component.css']
})

export class AppComponent {
  currentUser: User;
  searchquery: any = {};

  constructor(
    private router: Router,
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
    if (location.pathname !== '/search')
      this.router.navigate(['/search'], { queryParams: { search: this.searchquery.search } });
    else
      this.router.navigateByUrl(`/index`).then(() => this.router.navigate(['/search'], { queryParams: { search: this.searchquery.search } }));
  }
}
