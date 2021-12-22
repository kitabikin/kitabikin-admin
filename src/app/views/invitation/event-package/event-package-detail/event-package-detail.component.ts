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
import { Title } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// MODEL
import { EventPackageData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';

// STORE
import { selectEventPackage } from '@store/event-package/event-package.selectors';

// PACKAGE
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { faPen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'kb-event-package-detail',
  templateUrl: './event-package-detail.component.html',
  styleUrls: ['./event-package-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventPackageDetailComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  faPen = faPen;

  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Undangan', link: '/invitation' },
    { label: 'Paket Acara', link: '/invitation/event-package' },
    { label: 'Detail', link: '/invitation/event-package/detail' },
  ];

  // Variable
  id!: string;

  // Data
  eventPackageData$!: Observable<EventPackageData | undefined>;

  private unsubscribeEventPackage$ = new Subject<void>();

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private globalService: GlobalService,
    private translateService: TranslateService,
    private actions$: Actions,
    private store: Store<any>,
    private toastr: ToastrService
  ) {
    this.settingsAll();

    this.translateService.onLangChange.subscribe((event) => {
      this.settingsAll();
    });

    this.id = this.route.snapshot.params['id'];
  }

  settingsAll(): void {
    const word = ['event-package', 'detail'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.detail} ${trans['event-package']}`;
      this.description = `${trans.detail} ${trans['event-package']}`;

      // Title & Description
      this.title = this.globalService.title;
      this.titleService.setTitle(`${this.label} | ${this.title}`);
      this.globalService.changeLabel(this.label);
      this.globalService.changeDescription(this.description);
    });
  }

  ngOnInit(): void {
    this.getEventPackage();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeEventPackage$.next();
    this.unsubscribeEventPackage$.complete();
  }

  ngAfterViewInit(): void {}

  // GET =====================================================================================================
  getEventPackage(): void {
    this.eventPackageData$ = this.store.pipe(
      select(selectEventPackage(this.id)),
      takeUntil(this.unsubscribeEventPackage$)
    );
  }
}
