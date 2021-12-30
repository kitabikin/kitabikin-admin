import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// MODELS
import { InvitationGuestBook } from '@models';

// PACKAGES
import qs from 'qs';

@Injectable({
  providedIn: 'root',
})
export class InvitationGuestBookService {
  // API URL
  apiUrl = `api-core/v1/invitation-guest-book`;

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getTotal(params: any): Observable<InvitationGuestBook> {
    const merge = qs.stringify(params);
    return this.http
      .get<InvitationGuestBook>(`${this.apiUrl}/total?${merge}`, this.httpOptions)
      .pipe(map((response) => new InvitationGuestBook().deserialize(response)));
  }

  getList(params: any): Observable<InvitationGuestBook> {
    const merge = qs.stringify(params);
    return this.http
      .get<InvitationGuestBook>(`${this.apiUrl}?${merge}`, this.httpOptions)
      .pipe(map((response) => new InvitationGuestBook().deserialize(response)));
  }

  getSingle(uniq: any, params: any): Observable<InvitationGuestBook> {
    const merge = qs.stringify(params);
    return this.http
      .get<InvitationGuestBook>(`${this.apiUrl}/${uniq}?${merge}`, this.httpOptions)
      .pipe(map((response) => new InvitationGuestBook().deserialize(response)));
  }

  createItem(item: any): Observable<InvitationGuestBook> {
    return this.http
      .post<InvitationGuestBook>(this.apiUrl, JSON.stringify(item), this.httpOptions)
      .pipe(map((response) => new InvitationGuestBook().deserialize(response)));
  }

  updateItem(uniq: any, item: any): Observable<InvitationGuestBook> {
    return this.http
      .put<InvitationGuestBook>(`${this.apiUrl}/${uniq}`, JSON.stringify(item), this.httpOptions)
      .pipe(map((response) => new InvitationGuestBook().deserialize(response)));
  }

  importItem(item: any): Observable<InvitationGuestBook> {
    return this.http
      .post<InvitationGuestBook>(`${this.apiUrl}/upload`, item, {
        reportProgress: true,
        observe: 'events',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      .pipe(map((response) => new InvitationGuestBook().deserialize(response)));
  }
}
