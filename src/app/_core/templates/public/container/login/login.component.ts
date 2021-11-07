import { Component } from '@angular/core';

@Component({
  selector: 'kb-public-login',
  template: `
    <div class="public__login">
      <kb-public-navbar-login></kb-public-navbar-login>
      <router-outlet></router-outlet>
      <kb-public-footer-login></kb-public-footer-login>
    </div>
  `,
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {}
