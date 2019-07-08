import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserForLogin, User } from '../_models/user';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { AlertifyService } from './alertify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private endpoints = {
    login: '/auth/login',
    register: '/auth/register'
  };

  public jwtHelper = new JwtHelperService();

  public token$ = new BehaviorSubject(null);
  public token = null;

  public decodedToken: any;
  public loggedInUser: any = {};

  constructor(
    public httpClient: HttpClient,
    public router: Router,
    public alertifyService: AlertifyService
  ) {
    this.init();
  }

  init() {
    // subscribe to token changes
    this.token$.subscribe(token => {
      this.token = token;
      this.decodedToken = this.jwtHelper.decodeToken(token);
      this.loggedInUser = this.decodedToken
        ? {
            ...JSON.parse( localStorage.getItem('user') )
          }
        : null
      ;
    });

    // fetch token from local storage, update/init authService if it exists
    const existingToken = localStorage.getItem('token');
    if (existingToken) {
      this.token$.next(existingToken);
    }
  }

  public register(user: User) {
    const url = environment.webservices.baseUrl + this.endpoints.register;
    return this.httpClient.post(url, user);
  }

  public login(userForLogin: UserForLogin) {
    const url = environment.webservices.baseUrl + this.endpoints.login;
    return this.httpClient.post(url, userForLogin)
      .pipe(
        tap((response: any) => {
          if (response.token) {
            this.updateLoggedInUser(response.user);
            localStorage.setItem('token', response.token);
            this.token$.next(response.token);
          }
        })
      )
    ;
  }

  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.token$.next(null);
    this.alertifyService.message('Logged out.');
    this.router.navigate(['/']);
  }

  get isLoggedIn() {
    return !this.jwtHelper.isTokenExpired(this.token);
  }

  updateLoggedInUser(userPartial: any) {
    this.loggedInUser = {
      ...this.loggedInUser,
      ...userPartial
    };
    localStorage.setItem('user', JSON.stringify(this.loggedInUser));
  }
}
