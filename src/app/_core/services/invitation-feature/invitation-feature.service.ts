import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// MODELS
import { InvitationFeature } from '@models';

// PACKAGES
import qs from 'qs';

@Injectable({
  providedIn: 'root',
})
export class InvitationFeatureService {
  // API URL
  apiUrl = `api-core/v1/invitation-feature`;

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getTotal(params: any): Observable<InvitationFeature> {
    const merge = qs.stringify(params);
    return this.http
      .get<InvitationFeature>(`${this.apiUrl}/total?${merge}`, this.httpOptions)
      .pipe(map((response) => new InvitationFeature().deserialize(response)));
  }

  getList(params: any): Observable<InvitationFeature> {
    const merge = qs.stringify(params);
    return this.http
      .get<InvitationFeature>(`${this.apiUrl}?${merge}`, this.httpOptions)
      .pipe(map((response) => new InvitationFeature().deserialize(response)));
  }

  getSingle(uniq: any, params: any): Observable<InvitationFeature> {
    const merge = qs.stringify(params);
    return this.http
      .get<InvitationFeature>(`${this.apiUrl}/${uniq}?${merge}`, this.httpOptions)
      .pipe(map((response) => new InvitationFeature().deserialize(response)));
  }

  createItem(item: any): Observable<InvitationFeature> {
    return this.http
      .post<InvitationFeature>(this.apiUrl, JSON.stringify(item), this.httpOptions)
      .pipe(map((response) => new InvitationFeature().deserialize(response)));
  }

  updateItem(uniq: any, item: any): Observable<InvitationFeature> {
    return this.http
      .put<InvitationFeature>(`${this.apiUrl}/${uniq}`, JSON.stringify(item), this.httpOptions)
      .pipe(map((response) => new InvitationFeature().deserialize(response)));
  }
}
