import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// MODELS
import { Theme } from '@models';

// PACKAGES
import qs from 'qs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // API URL
  apiUrl = `api-core/v1/theme`;

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getTotal(params: any): Observable<Theme> {
    const merge = qs.stringify(params);
    return this.http
      .get<Theme>(`${this.apiUrl}/total?${merge}`, this.httpOptions)
      .pipe(map((response) => new Theme().deserialize(response)));
  }

  getList(params: any): Observable<Theme> {
    const merge = qs.stringify(params);
    return this.http
      .get<Theme>(`${this.apiUrl}?${merge}`, this.httpOptions)
      .pipe(map((response) => new Theme().deserialize(response)));
  }

  getSingle(uniq: any, params: any): Observable<Theme> {
    const merge = qs.stringify(params);
    return this.http
      .get<Theme>(`${this.apiUrl}/${uniq}?${merge}`, this.httpOptions)
      .pipe(map((response) => new Theme().deserialize(response)));
  }

  createItem(item: any): Observable<Theme> {
    return this.http
      .post<Theme>(this.apiUrl, JSON.stringify(item), this.httpOptions)
      .pipe(map((response) => new Theme().deserialize(response)));
  }

  updateItem(uniq: any, item: any): Observable<Theme> {
    return this.http
      .put<Theme>(`${this.apiUrl}/${uniq}`, JSON.stringify(item), this.httpOptions)
      .pipe(map((response) => new Theme().deserialize(response)));
  }
}
