import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// MODELS
import { ThemeFeature } from '@models';

// PACKAGES
import qs from 'qs';

@Injectable({
  providedIn: 'root',
})
export class ThemeFeatureService {
  // API URL
  apiUrl = `api-core/v1/theme-feature`;

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getTotal(params: any): Observable<ThemeFeature> {
    const merge = qs.stringify(params);
    return this.http
      .get<ThemeFeature>(`${this.apiUrl}/total?${merge}`, this.httpOptions)
      .pipe(map((response) => new ThemeFeature().deserialize(response)));
  }

  getList(params: any): Observable<ThemeFeature> {
    const merge = qs.stringify(params);
    return this.http
      .get<ThemeFeature>(`${this.apiUrl}?${merge}`, this.httpOptions)
      .pipe(map((response) => new ThemeFeature().deserialize(response)));
  }

  getSingle(uniq: any, params: any): Observable<ThemeFeature> {
    const merge = qs.stringify(params);
    return this.http
      .get<ThemeFeature>(`${this.apiUrl}/${uniq}?${merge}`, this.httpOptions)
      .pipe(map((response) => new ThemeFeature().deserialize(response)));
  }

  createItem(item: any): Observable<ThemeFeature> {
    return this.http
      .post<ThemeFeature>(this.apiUrl, JSON.stringify(item), this.httpOptions)
      .pipe(map((response) => new ThemeFeature().deserialize(response)));
  }

  updateItem(uniq: any, item: any): Observable<ThemeFeature> {
    return this.http
      .put<ThemeFeature>(`${this.apiUrl}/${uniq}`, JSON.stringify(item), this.httpOptions)
      .pipe(map((response) => new ThemeFeature().deserialize(response)));
  }
}
