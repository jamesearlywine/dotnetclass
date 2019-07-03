import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserForLogin } from '../models/user';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  userForLogin: UserForLogin = {
    username: null,
    password: null
  };

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.userForLogin)
      .subscribe(
        response => {
          console.log('NavComponent.login, response: ', response);
        },
        error => {
          console.log('NavComponent.login, error: ', error);
        }
      )
    ;
  }

  logout() {
    this.authService.logout();
  }

  get isLoggedIn() {
    return this.authService.isLoggedIn;
  }

}
