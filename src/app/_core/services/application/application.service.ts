import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// MODELS
import { Application } from '@models';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  // API URL
  apiUrl = `api-core/v1/application`;

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getTotal(params: any): Observable<Application> {
    const merge = new URLSearchParams(params);
    return this.http
      .get<Application>(`${this.apiUrl}?${merge}&count=true`, this.httpOptions)
      .pipe(map((response) => new Application().deserialize(response)));
  }

  getList(params: any): Observable<Application> {
    const merge = new URLSearchParams(params);
    return this.http
      .get<Application>(`${this.apiUrl}?${merge}`, this.httpOptions)
      .pipe(map((response) => new Application().deserialize(response)));
  }

  getSingle(uniq: any, params: any): Observable<Application> {
    const merge = new URLSearchParams(params);
    return this.http
      .get<Application>(`${this.apiUrl}/${uniq}?${merge}`, this.httpOptions)
      .pipe(map((response) => new Application().deserialize(response)));
  }

  createItem(item: any): Observable<Application> {
    return this.http
      .post<Application>(this.apiUrl, JSON.stringify(item), this.httpOptions)
      .pipe(map((response) => new Application().deserialize(response)));
  }

  updateItem(uniq: any, item: any): Observable<Application> {
    return this.http
      .put<Application>(`${this.apiUrl}/${uniq}`, JSON.stringify(item), this.httpOptions)
      .pipe(map((response) => new Application().deserialize(response)));
  }

  deleteItem(uniq: any, params: any): Observable<Application> {
    const merge = new URLSearchParams(params);
    return this.http
      .delete<Application>(`${this.apiUrl}/${uniq}?${merge}`, this.httpOptions)
      .pipe(map((response) => new Application().deserialize(response)));
  }
}
