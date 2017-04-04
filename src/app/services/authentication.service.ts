import { Injectable } from '@angular/core';

@Injectable()
export class AuthenticationService {

  constructor() { }

  logout() {
    localStorage.removeItem("user");
  }

  login(user) {
    localStorage.setItem("user", authenticatedUser);
  }

  checkCredentials() {
    if (localStorage.getItem("user") === null)
      return false;
    else
      return true;
  }
}
