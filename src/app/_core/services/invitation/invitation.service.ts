import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// MODELS
import { Invitation } from '@models';

// PACKAGES
import qs from 'qs';

@Injectable({
  providedIn: 'root',
})
export class InvitationService {
  // API URL
  apiUrl = `api-core/v1/invitation`;

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getTotal(params: any): Observable<Invitation> {
    const merge = qs.stringify(params);
    return this.http
      .get<Invitation>(`${this.apiUrl}/total?${merge}`, this.httpOptions)
      .pipe(map((response) => new Invitation().deserialize(response)));
  }

  getList(params: any): Observable<Invitation> {
    const merge = qs.stringify(params);
    return this.http
      .get<Invitation>(`${this.apiUrl}?${merge}`, this.httpOptions)
      .pipe(map((response) => new Invitation().deserialize(response)));
  }

  getSingle(uniq: any, params: any): Observable<Invitation> {
    const merge = qs.stringify(params);
    return this.http
      .get<Invitation>(`${this.apiUrl}/${uniq}?${merge}`, this.httpOptions)
      .pipe(map((response) => new Invitation().deserialize(response)));
  }

  createItem(item: any): Observable<Invitation> {
    return this.http
      .post<Invitation>(this.apiUrl, JSON.stringify(item), this.httpOptions)
      .pipe(map((response) => new Invitation().deserialize(response)));
  }

  updateItem(uniq: any, item: any): Observable<Invitation> {
    return this.http
      .put<Invitation>(`${this.apiUrl}/${uniq}`, JSON.stringify(item), this.httpOptions)
      .pipe(map((response) => new Invitation().deserialize(response)));
  }
}
