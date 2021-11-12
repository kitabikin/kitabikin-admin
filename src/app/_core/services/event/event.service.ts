import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// MODELS
import { Event } from '@models';

// PACKAGES
import qs from 'qs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  // API URL
  apiUrl = `api-core/v1/event`;

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getTotal(params: any): Observable<Event> {
    const merge = qs.stringify(params);
    return this.http
      .get<Event>(`${this.apiUrl}/total?${merge}`, this.httpOptions)
      .pipe(map((response) => new Event().deserialize(response)));
  }

  getList(params: any): Observable<Event> {
    const merge = qs.stringify(params);
    return this.http
      .get<Event>(`${this.apiUrl}?${merge}`, this.httpOptions)
      .pipe(map((response) => new Event().deserialize(response)));
  }

  getSingle(uniq: any, params: any): Observable<Event> {
    const merge = qs.stringify(params);
    return this.http
      .get<Event>(`${this.apiUrl}/${uniq}?${merge}`, this.httpOptions)
      .pipe(map((response) => new Event().deserialize(response)));
  }

  createItem(item: any): Observable<Event> {
    return this.http
      .post<Event>(this.apiUrl, JSON.stringify(item), this.httpOptions)
      .pipe(map((response) => new Event().deserialize(response)));
  }

  updateItem(uniq: any, item: any): Observable<Event> {
    return this.http
      .put<Event>(`${this.apiUrl}/${uniq}`, JSON.stringify(item), this.httpOptions)
      .pipe(map((response) => new Event().deserialize(response)));
  }
}
