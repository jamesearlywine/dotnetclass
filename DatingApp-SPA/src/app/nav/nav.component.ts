import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { UserForLogin } from '../_models/user';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';
import { UserService } from '../_services/user.service';

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
    private alertifyService: AlertifyService,
    private userService: UserService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.userForLogin)
      .subscribe(
        response => {
          this.alertifyService.success('Logged in.');
          this.router.navigate(['/members']);
        },
        error => {
          this.alertifyService.error(error);
        },
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
