import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// MODELS
import { Role } from '@models';

// PACKAGES
import qs from 'qs';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  // API URL
  apiUrl = `api-core/v1/role`;

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getTotal(params: any): Observable<Role> {
    const merge = qs.stringify(params);
    return this.http
      .get<Role>(`${this.apiUrl}/total?${merge}`, this.httpOptions)
      .pipe(map((response) => new Role().deserialize(response)));
  }

  getList(params: any): Observable<Role> {
    const merge = qs.stringify(params);
    return this.http
      .get<Role>(`${this.apiUrl}?${merge}`, this.httpOptions)
      .pipe(map((response) => new Role().deserialize(response)));
  }

  getSingle(uniq: any, params: any): Observable<Role> {
    const merge = qs.stringify(params);
    return this.http
      .get<Role>(`${this.apiUrl}/${uniq}?${merge}`, this.httpOptions)
      .pipe(map((response) => new Role().deserialize(response)));
  }

  createItem(item: any): Observable<Role> {
    return this.http
      .post<Role>(this.apiUrl, JSON.stringify(item), this.httpOptions)
      .pipe(map((response) => new Role().deserialize(response)));
  }

  updateItem(uniq: any, item: any): Observable<Role> {
    return this.http
      .put<Role>(`${this.apiUrl}/${uniq}`, JSON.stringify(item), this.httpOptions)
      .pipe(map((response) => new Role().deserialize(response)));
  }
}
