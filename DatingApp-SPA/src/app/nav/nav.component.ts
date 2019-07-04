import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserForLogin } from '../models/user';
import { AlertifyService } from '../services/alertify.service';

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
    public authService: AuthService,
    private alertifyService: AlertifyService
  ) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.userForLogin)
      .subscribe(
        response => {
          this.alertifyService.success('Logged in.');
        },
        error => {
          this.alertifyService.error(error);
        }
      )
    ;
  }

  logout() {
    this.authService.logout();
    this.alertifyService.message('Logged out.');
  }

  get isLoggedIn() {
    return this.authService.isLoggedIn;
  }

}
