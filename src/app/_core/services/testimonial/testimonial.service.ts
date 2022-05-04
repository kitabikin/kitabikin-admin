import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// MODELS
import { Testimonial } from '@models';

// PACKAGES
import qs from 'qs';

@Injectable({
  providedIn: 'root',
})
export class TestimonialService {
  // API URL
  apiUrl = `api-core/v1/testimonial`;

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getTotal(params: any): Observable<Testimonial> {
    const merge = qs.stringify(params);
    return this.http
      .get<Testimonial>(`${this.apiUrl}/total?${merge}`, this.httpOptions)
      .pipe(map((response) => new Testimonial().deserialize(response)));
  }

  getList(params: any): Observable<Testimonial> {
    const merge = qs.stringify(params);
    return this.http
      .get<Testimonial>(`${this.apiUrl}?${merge}`, this.httpOptions)
      .pipe(map((response) => new Testimonial().deserialize(response)));
  }

  getSingle(uniq: any, params: any): Observable<Testimonial> {
    const merge = qs.stringify(params);
    return this.http
      .get<Testimonial>(`${this.apiUrl}/${uniq}?${merge}`, this.httpOptions)
      .pipe(map((response) => new Testimonial().deserialize(response)));
  }

  createItem(item: any): Observable<Testimonial> {
    return this.http
      .post<Testimonial>(this.apiUrl, JSON.stringify(item), this.httpOptions)
      .pipe(map((response) => new Testimonial().deserialize(response)));
  }

  updateItem(uniq: any, item: any): Observable<Testimonial> {
    return this.http
      .put<Testimonial>(`${this.apiUrl}/${uniq}`, JSON.stringify(item), this.httpOptions)
      .pipe(map((response) => new Testimonial().deserialize(response)));
  }
}
