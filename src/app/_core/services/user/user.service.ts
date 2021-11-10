import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// MODELS
import { User } from '@models';

// PACKAGES
import qs from 'qs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // API URL
  apiUrl = `api-core/v1/user`;

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getTotal(params: any): Observable<User> {
    const merge = qs.stringify(params);
    return this.http
      .get<User>(`${this.apiUrl}/total?${merge}`, this.httpOptions)
      .pipe(map((response) => new User().deserialize(response)));
  }

  getList(params: any): Observable<User> {
    const merge = qs.stringify(params);
    return this.http
      .get<User>(`${this.apiUrl}?${merge}`, this.httpOptions)
      .pipe(map((response) => new User().deserialize(response)));
  }

  getSingle(uniq: any, params: any): Observable<User> {
    const merge = qs.stringify(params);
    return this.http
      .get<User>(`${this.apiUrl}/${uniq}?${merge}`, this.httpOptions)
      .pipe(map((response) => new User().deserialize(response)));
  }

  createItem(item: any): Observable<User> {
    return this.http
      .post<User>(this.apiUrl, JSON.stringify(item), this.httpOptions)
      .pipe(map((response) => new User().deserialize(response)));
  }

  updateItem(uniq: any, item: any): Observable<User> {
    return this.http
      .put<User>(`${this.apiUrl}/${uniq}`, JSON.stringify(item), this.httpOptions)
      .pipe(map((response) => new User().deserialize(response)));
  }
}
