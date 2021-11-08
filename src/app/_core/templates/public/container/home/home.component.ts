import { Component } from '@angular/core';

@Component({
  selector: 'app-public-home',
  template: `
    <app-public-navbar></app-public-navbar>
    <router-outlet></router-outlet>
    <app-public-footer></app-public-footer>
  `,
})
export class HomeComponent {}
