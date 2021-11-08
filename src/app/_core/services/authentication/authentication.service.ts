import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Login, LoginData } from '@models';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  // API URL
  apiUrl = `api-core/v1/auth`;

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  private adminUserSubject: BehaviorSubject<LoginData>;
  public adminUser: Observable<LoginData>;

  private adminTokenSubject: BehaviorSubject<string>;
  public adminToken: Observable<string>;

  constructor(private http: HttpClient) {
    this.adminUserSubject = new BehaviorSubject<LoginData>(
      JSON.parse(localStorage.getItem('kitabikin-admin-user') || 'null')
    );
    this.adminUser = this.adminUserSubject.asObservable();
    this.adminTokenSubject = new BehaviorSubject<string>(localStorage.getItem('kitabikin-admin-token') || '');
    this.adminToken = this.adminTokenSubject.asObservable();
  }

  public get adminUserValue(): LoginData {
    return this.adminUserSubject.value;
  }

  public get adminTokenValue(): string {
    return this.adminTokenSubject.value;
  }

  login(username: string, password: string, isRememberMe: boolean): Observable<any> {
    const application = 'kitabikin';
    return this.http
      .post<Login>(`${this.apiUrl}/login`, {
        username,
        password,
        application,
      })
      .pipe(
        map((result) => {
          if (result.error === 0) {
            if (isRememberMe) {
              localStorage.setItem('kitabikin-admin-username', username);
            }
          }
          return result;
        })
      );
  }

  setSession(data: LoginData) {
    localStorage.setItem('kitabikin-admin-user', JSON.stringify(data));
    this.adminUserSubject.next(data);
    this.setToken(data.token);
  }

  setToken(token: string) {
    localStorage.setItem('kitabikin-admin-token', token);
    this.adminTokenSubject.next(token);
  }

  async logout() {
    localStorage.removeItem('kitabikin-admin-user');
    localStorage.removeItem('kitabikin-admin-token');

    // @ts-ignore
    this.adminUserSubject.next(null);
    this.adminTokenSubject.next('');
  }

  forgotPassword(item: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset`, JSON.stringify(item), this.httpOptions);
  }

  get dataRememberMe() {
    return localStorage.getItem('kitabikin-admin-username')
      ? localStorage.getItem('kitabikin-admin-username')
      : null;
  }
}
