import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// PACKAGES
import qs from 'qs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getFile(url: string, params: any): Observable<any> {
    const merge = qs.stringify(params);
    return this.http.get(`${url}?${merge}`, {
      responseType: 'blob',
      reportProgress: true,
      observe: 'events',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  }
}
