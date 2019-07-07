import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { User } from 'src/app/_models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  endpoints = {
    users: '/users',
    photos: '/users/{userId}/photos',
    setMainPhoto: '/users/{userId}/photos/{photoId}/setMain'
  };

  constructor(
    private httpClient: HttpClient
  ) { }

  getUsers(): Observable<User[]> {
    const url = environment.webservices.baseUrl
      + this.endpoints.users
    ;

    return this.httpClient.get<User[]>(url);
  }

  getUser(id: number): Observable<User> {
    const url = environment.webservices.baseUrl
      + this.endpoints.users
      + '/' + id
    ;

    return this.httpClient.get<User>(url);
  }

  updateUser(id: number, user: User): Observable<any> {
    const url = environment.webservices.baseUrl + this.endpoints.users + '/' + id;

    return this.httpClient.put(url, user);
  }

  setMainPhoto(userId: number, photoId: number): Observable<any> {
    const url = environment.webservices.baseUrl
      + this.endpoints.setMainPhoto
      .replace('{userId}', userId.toString())
      .replace('{photoId}', photoId.toString())
    ;

    return this.httpClient.post(url, {});
  }

  deletePhoto(userId: number, photoId: number): Observable<any> {
    const url = environment.webservices.baseUrl
      + this.endpoints.photos
      .replace('{userId}', userId.toString())
      + '/' + photoId
    ;

    return this.httpClient.delete(url)
      .pipe(
        tap(response => {

        })
      )
    ;
  }

}
