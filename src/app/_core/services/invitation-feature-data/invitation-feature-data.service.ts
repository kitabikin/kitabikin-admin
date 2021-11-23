import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// MODELS
import { InvitationFeatureDataColumn } from '@models';

// PACKAGES
import qs from 'qs';

@Injectable({
  providedIn: 'root',
})
export class InvitationFeatureDataColumnService {
  // API URL
  apiUrl = `api-core/v1/invitation-feature-data`;

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  updateItem(uniq: any, item: any): Observable<InvitationFeatureDataColumn> {
    return this.http
      .put<InvitationFeatureDataColumn>(`${this.apiUrl}/${uniq}`, JSON.stringify(item), this.httpOptions)
      .pipe(map((response) => new InvitationFeatureDataColumn().deserialize(response)));
  }
}
