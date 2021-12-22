import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// MODELS
import { EventPackage } from '@models';

// PACKAGES
import qs from 'qs';

@Injectable({
  providedIn: 'root',
})
export class EventPackageService {
  // API URL
  apiUrl = `api-core/v1/event-package`;

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getTotal(params: any): Observable<EventPackage> {
    const merge = qs.stringify(params);
    return this.http
      .get<EventPackage>(`${this.apiUrl}/total?${merge}`, this.httpOptions)
      .pipe(map((response) => new EventPackage().deserialize(response)));
  }

  getList(params: any): Observable<EventPackage> {
    const merge = qs.stringify(params);
    return this.http
      .get<EventPackage>(`${this.apiUrl}?${merge}`, this.httpOptions)
      .pipe(map((response) => new EventPackage().deserialize(response)));
  }

  getSingle(uniq: any, params: any): Observable<EventPackage> {
    const merge = qs.stringify(params);
    return this.http
      .get<EventPackage>(`${this.apiUrl}/${uniq}?${merge}`, this.httpOptions)
      .pipe(map((response) => new EventPackage().deserialize(response)));
  }

  createItem(item: any): Observable<EventPackage> {
    return this.http
      .post<EventPackage>(this.apiUrl, JSON.stringify(item), this.httpOptions)
      .pipe(map((response) => new EventPackage().deserialize(response)));
  }

  updateItem(uniq: any, item: any): Observable<EventPackage> {
    return this.http
      .put<EventPackage>(`${this.apiUrl}/${uniq}`, JSON.stringify(item), this.httpOptions)
      .pipe(map((response) => new EventPackage().deserialize(response)));
  }
}
