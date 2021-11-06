import { Component } from '@angular/core';

@Component({
  selector: 'app-public-login',
  template: `
    <div class="public__login">
      <app-public-navbar-login></app-public-navbar-login>
      <router-outlet></router-outlet>
      <app-public-footer-login></app-public-footer-login>
    </div>
  `,
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {}
