import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy,
  AfterViewInit,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';

// SERVICE
import { GlobalService } from '@services/private';
import { AuthenticationService } from '@services';

// PACKAGE
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

import { faBars, faCaretDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'kb-private-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  faBars = faBars;
  faCaretDown = faCaretDown;
  adminUser: any;
  moment: any = moment;

  public isMenuCollapsed = true;

  // Variable
  isMobileExpanded!: boolean;

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private globalService: GlobalService,
    private translateService: TranslateService,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.adminUser.subscribe((x) => (this.adminUser = x));

    this.globalService.currentToggleMobileExpanded.subscribe((current) => {
      this.isMobileExpanded = current;
    });
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {}

  ngAfterViewInit(): void {}

  toggleMobileExpanded(): void {
    this.isMobileExpanded = !this.isMobileExpanded;
    this.globalService.changeToggleMobileExpanded(this.isMobileExpanded);
  }

  doLogout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/auth/login']);
  }
}
