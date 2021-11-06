import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// SERVICE
import { AuthenticationService } from '@services';

// PLUGIN
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthenticationGuard implements CanActivate {
  constructor(private router: Router, private authenticationService: AuthenticationService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const helper = new JwtHelperService();

    const adminUser = this.authenticationService.adminUserValue;
    const adminToken = this.authenticationService.adminTokenValue;

    if (adminUser === null) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    const isExpiredUser = helper.isTokenExpired(adminUser.token);
    const isExpired = helper.isTokenExpired(adminToken);

    if (adminUser && (!isExpiredUser || !isExpired)) {
      return true;
    }

    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
