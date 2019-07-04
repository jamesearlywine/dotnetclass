import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserForLogin } from '../models/user';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

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
    public httpClient: HttpClient
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
            ...this.loggedInUser,
            username: this.decodedToken.unique_name
          }
        : {}
      ;

      console.log('decodedToken: ', this.decodedToken);
      console.log('this.loggedInUser: ', this.loggedInUser);
    });

    // fetch token from local storage, update/init authService if it exists
    const existingToken = localStorage.getItem('token');
    if (existingToken) {
      this.token$.next(existingToken);
    }
  }

  public register(data: any) {
    const url = environment.webservices.auth.baseUrl + this.endpoints.register;
    return this.httpClient.post(url, data);
  }

  public login(userForLogin: UserForLogin) {
    const url = environment.webservices.auth.baseUrl + this.endpoints.login;
    return this.httpClient.post(url, userForLogin)
      .pipe(
        tap((response: any) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            this.token$.next(response.token);
          }
        })
      )
    ;
  }

  public logout() {
    localStorage.removeItem('token');
    this.token$.next(null);
  }

  get isLoggedIn() {
    return !this.jwtHelper.isTokenExpired(this.token);
  }
}
