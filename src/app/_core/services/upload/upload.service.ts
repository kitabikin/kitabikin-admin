import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// MODELS
import { Upload } from '@models';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  // API URL
  apiUrl = `api-core/v1/upload`;

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  createSingle(item: any): Observable<Upload> {
    return this.http
      .post<Upload>(`${this.apiUrl}/single`, item, {
        reportProgress: true,
        observe: 'events',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      .pipe(map((response) => new Upload().deserialize(response)));
  }
}
