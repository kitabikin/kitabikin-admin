import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

// SERVICE
import { GlobalService, SidebarService } from '@services/private';

// PACKAGE
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class SidebarResolver implements Resolve<any> {
  constructor(
    private globalService: GlobalService,
    private sidebarService: SidebarService,
    private translateService: TranslateService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const sidebarCode = route.data['sidebarCode'];

    const menu = this.sidebarService.getSidebars(sidebarCode, state.url);
    this.sidebarService.changeSidebar(menu);
  }
}
