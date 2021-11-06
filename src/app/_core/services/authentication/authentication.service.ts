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
  apiUrl = `api-backend/auth`;

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
      JSON.parse(localStorage.getItem('admin-user') || 'null')
    );
    this.adminUser = this.adminUserSubject.asObservable();
    this.adminTokenSubject = new BehaviorSubject<string>(localStorage.getItem('admin-token') || '');
    this.adminToken = this.adminTokenSubject.asObservable();
  }

  public get adminUserValue(): LoginData {
    return this.adminUserSubject.value;
  }

  public get adminTokenValue(): string {
    return this.adminTokenSubject.value;
  }

  login(username: string, password: string, isRememberMe: boolean): Observable<any> {
    const appCode = 'satudata-frontend';
    return this.http
      .post<Login>(`${this.apiUrl}/login2`, {
        username,
        password,
        app_code: appCode,
      })
      .pipe(
        map((result) => {
          if (result.error === 0) {
            if (isRememberMe) {
              localStorage.setItem('admin-username', username);
            }
          }
          return result;
        })
      );
  }

  setSession(data: LoginData) {
    localStorage.setItem('admin-user', JSON.stringify(data));
    this.adminUserSubject.next(data);
    this.setToken(data.token);
  }

  setToken(token: string) {
    localStorage.setItem('admin-token', token);
    this.adminTokenSubject.next(token);
  }

  async logout() {
    localStorage.removeItem('admin-user');
    localStorage.removeItem('admin-token');

    // @ts-ignore
    this.adminUserSubject.next(null);
    this.adminTokenSubject.next('');
  }

  forgotPassword(item: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset`, JSON.stringify(item), this.httpOptions);
  }

  get dataRememberMe() {
    return localStorage.getItem('admin-username') ? localStorage.getItem('admin-username') : null;
  }
}
