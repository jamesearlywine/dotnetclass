import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { User } from 'src/app/_models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  endpoints = {
    users: '/users'
  };

  constructor(
    private httpClient: HttpClient
  ) { }

  getUsers(): Observable<User[]> {
    const url = environment.webservices.baseUrl + this.endpoints.users;

    return this.httpClient.get<User[]>(url);
  }

  getUser(id: number): Observable<User> {
    const url = environment.webservices.baseUrl + this.endpoints.users + '/' + id;

    return this.httpClient.get<User>(url);
  }

  updateUser(id: number, user: User): Observable<any> {
    const url = environment.webservices.baseUrl + this.endpoints.users + '/' + id;

    return this.httpClient.put(url, user);
  }
}
