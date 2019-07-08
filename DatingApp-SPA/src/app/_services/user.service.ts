import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { User } from 'src/app/_models/user';
import { PaginatedResult } from '../_models/pagination';

export const UserServiceDefaults = {
  pagination: {
    pageNumber: 1,
    pageSize: 5
  },
  filters: {
    minAge: 18,
    maxAge: null,
    gender: null
  },
  sort: {
    orderBy: 'lastActive' // 'lastActive' || 'created'
  }
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  defaults: any;

  endpoints = {
    users: '/users',
    photos: '/users/{userId}/photos',
    setMainPhoto: '/users/{userId}/photos/{photoId}/setMain'
  };

  constructor(
    private httpClient: HttpClient
  ) {
    this.defaults = UserServiceDefaults;
  }

  getUsers(
    pageNumber: number|string = UserServiceDefaults.pagination.pageNumber,
    pageSize: number|string = UserServiceDefaults.pagination.pageSize,
    userParams?: any
  ): Observable<PaginatedResult<User[]>>
  {
    const url = environment.webservices.baseUrl
      + this.endpoints.users
    ;

    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();

    const sendingUserParams = {
      pageSize: pageSize ? pageSize.toString() : null,
      pageNumber: pageNumber ? pageNumber.toString() : null,
      ...userParams
    };

    Object.keys(sendingUserParams).forEach((key) => (sendingUserParams[key] == null) && delete sendingUserParams[key]);

    const params = new HttpParams({
      fromObject: sendingUserParams
    });

    return this.httpClient
      .get(
        url,
        {
          observe: 'response',
          params: params
        }
      )
      .pipe(
        map(httpResponse => {
          paginatedResult.result = <User[]>httpResponse.body;
          paginatedResult.pagination = httpResponse.headers.get('pagination')
            ? JSON.parse(httpResponse.headers.get('pagination'))
            : null
          ;
          return paginatedResult;
        })
      )
    ;
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

    return this.httpClient.delete(url);
  }

}
