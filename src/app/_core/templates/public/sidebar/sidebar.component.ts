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
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

// SERVICE
import { GlobalService, SidebarService } from '@services';

// PACKAGE
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-public-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  moment: any = moment;

  currentRoute!: any;
  routeEmitter$ = new BehaviorSubject<any>(this.currentRoute);

  title!: string;
  titleEmitter$ = new BehaviorSubject<string>(this.title);

  menu!: any[];
  menuEmitter$ = new BehaviorSubject<any[]>(this.menu);

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private globalService: GlobalService,
    private sidebarService: SidebarService,
    private translateService: TranslateService
  ) {
    this.globalService.currentSidebar.subscribe((current) => {
      this.title = current;
      this.titleEmitter$.next(current);
      this.routeEmitter$.next(null);
    });

    this.sidebarService.currentSidebar.subscribe((current) => {
      this.menu = current;
      this.menuEmitter$.next(current);
    });
  }

  ngOnInit(): void {
    this.routeEmitter$.next(this.router.url.split('/')[3]);
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {}

  ngAfterViewInit(): void {}

  redirectTo(link: string): void {
    this.router.navigate([link]).then(() => {
      this.routeEmitter$.next(this.router.url.split('/')[3]);
    });
  }
}
