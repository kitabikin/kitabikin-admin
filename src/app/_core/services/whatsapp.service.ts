import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WhatsappService {
  // API URL
  apiUrl = 'api-whatsapp/v2/send-message';

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  sendInvitation(item: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, JSON.stringify(item), this.httpOptions);
  }
}
