import { Component } from '@angular/core';

import { GlobalService } from '@services/private';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  template: `
    <ngx-loading-bar [includeSpinner]="false" color="#09B8F1"></ngx-loading-bar>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  title = 'kitabikin-admin';
  lang?: string;

  constructor(private globalService: GlobalService, private translateService: TranslateService) {
    this.translateService.setDefaultLang('id');
    this.translateService.use('id');

    this.globalService.changeCanonicalURL();
  }
}
