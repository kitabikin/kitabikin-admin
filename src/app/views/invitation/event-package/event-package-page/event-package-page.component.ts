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
import { takeUntil, filter, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

// MODEL
import { Pagination, EventPackageData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';

// STORE
import {
  selectAllEventPackage,
  selectIsLoadingList as selectIsLoadingListEventPackage,
  selectIsLoadingDelete as selectIsLoadingDeleteEventPackage,
  selectError as selectErrorEventPackage,
  selectPagination as selectPaginationEventPackage,
} from '@store/event-package/event-package.selectors';
import { fromEventPackageActions } from '@store/event-package/event-package.actions';

import { selectAllEvent } from '@store/event/event.selectors';
import { fromEventActions } from '@store/event/event.actions';

// PACKAGE
import { isEmpty, isEqual, assign, isArray } from 'lodash';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { faSearchPlus, faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'kb-event-package-page',
  templateUrl: './event-package-page.component.html',
  styleUrls: ['./event-package-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventPackagePageComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  faSearchPlus = faSearchPlus;
  faPlus = faPlus;
  faPen = faPen;
  faTrash = faTrash;

  env: any = environment;
  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Undangan', link: '/invitation' },
    { label: 'Paket Acara ', link: '/invitation/event-package' },
  ];
  totalColumn = new Array(4);

  // Variable
  perPageItems = [
    { value: 10, label: '10' },
    { value: 25, label: '25' },
  ];
  pageItems: any[] = [];

  filter = {
    sort: '',
    direction: '',
    perPage: 10,
    currentPage: 1,
    search: '',
    event: [],
    status_is_active: [],
  };

  // Data
  eventPackageData$!: Observable<EventPackageData[]>;
  eventPackageIsLoadingList$!: Observable<boolean>;
  eventPackageIsLoadingDelete$!: Observable<boolean>;
  eventPackageIsError$!: Observable<boolean>;
  eventPackageIsError = false;
  eventPackageErrorMessage!: string;
  eventPackagePagination$!: Observable<Pagination>;
  eventPackagePages: any;

  eventData!: any[];
  statusActiveData = [
    { value: true, label: 'Aktif', checked: false },
    { value: false, label: 'Arsip', checked: false },
  ];

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
  }

  settingsAll(): void {
    const word = ['event-package', 'list'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = trans['event-package'];
      this.description = `${trans.list} ${trans['event-package']}`;

      // Title & Description
      this.title = this.globalService.title;
      this.titleService.setTitle(`${this.label} | ${this.title}`);
      this.globalService.changeLabel(this.label);
      this.globalService.changeDescription(this.description);
    });
  }

  ngOnInit(): void {
    this.getAllEventPackage();
    this.getAllEvent();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeEventPackage$.next();
    this.unsubscribeEventPackage$.complete();
  }

  ngAfterViewInit(): void {}

  get checkFilter(): boolean {
    if (this.filter.search) {
      return true;
    }
    return false;
  }

  getAllEventPackage(): void {
    const pCurrent =
      Number(this.filter.perPage) * Number(this.filter.currentPage) - Number(this.filter.perPage);

    const pWhere: any[] = [
      {
        is_delete: false,
      },
    ];

    if (this.filter.event) {
      pWhere.push({
        id_event: this.filter.event,
      });
    }

    if (this.filter.status_is_active) {
      pWhere.push({
        is_active: this.filter.status_is_active,
      });
    }

    const params = {
      search: this.filter.search,
      limit: this.filter.perPage,
      start: pCurrent,
      where: pWhere,
      with: [{ event: true }],
    };

    if (this.filter.sort) {
      assign(params, { sort: `${this.filter.sort}:${this.filter.direction}` });
    } else {
      assign(params, { sort: 'modified_at:desc' });
    }

    this.store.dispatch(
      fromEventPackageActions.loadAllEventPackage({
        params,
        pagination: true,
        infinite: false,
      })
    );

    this.store
      .pipe(
        select(selectErrorEventPackage),
        filter((val) => val !== null && val.error)
      )
      .subscribe((result) => {
        if (result.error) {
          this.toastr.error(result.message, 'EventPackage');
        }
      });

    this.eventPackageIsLoadingList$ = this.store.pipe(select(selectIsLoadingListEventPackage));
    this.eventPackagePagination$ = this.store.pipe(select(selectPaginationEventPackage));

    this.eventPackageData$ = this.store.pipe(
      select(selectAllEventPackage),
      map((data: EventPackageData[]) => {
        return data.map((result: any) => new EventPackageData().deserialize(result));
      })
    );
  }

  getAllEvent(): void {
    const pSort = 'name:asc';

    const pWhere: any[] = [
      {
        is_delete: false,
      },
    ];

    const params = {
      sort: pSort,
      where: pWhere,
    };

    this.store.dispatch(
      fromEventActions.loadAllEvent({
        params,
        pagination: false,
        infinite: false,
      })
    );

    this.store
      .pipe(
        select(selectAllEvent),
        filter((val) => val.length !== 0)
      )
      .subscribe((result) => {
        const options: any[] = [];
        result.map((res) => {
          options.push({
            value: res.id_event,
            label: res.name,
            checked: false,
          });
        });

        this.eventData = options;
      });
  }

  filterSort(event: string): void {
    let dir = '';
    if (this.filter.sort === event) {
      if (this.filter.direction === 'desc') {
        dir = 'asc';
      } else if (this.filter.direction === 'asc') {
        dir = 'desc';
      }
    } else {
      dir = 'desc';
    }

    this.filter.sort = event;
    this.filter.direction = dir;
    this.filter.currentPage = 1;
    this.getAllEventPackage();
  }

  filterSearch(event: string): void {
    const value = isEmpty(event) === false ? event : '';
    if (this.filter.search !== value) {
      this.filter.search = value;
      this.filter.currentPage = 1;
      this.getAllEventPackage();
    }
  }

  filterPagination(event: any): void {
    const prev = [this.filter.perPage, this.filter.currentPage];
    const curr = [event.perPage, event.currentPage];

    if (isEqual(prev, curr)) {
      return;
    }

    this.filter.perPage = event.perPage;
    this.filter.currentPage = event.currentPage;
    this.getAllEventPackage();
  }

  filterEvent(event: any): void {
    this.filter.event = event;
    this.filter.currentPage = 1;
    this.getAllEventPackage();
  }

  filterStatusActive(event: any): void {
    this.filter.status_is_active = event;
    this.filter.currentPage = 1;
    this.getAllEventPackage();
  }

  onDelete(id: string | undefined, isDelete: boolean = true): void {
    const bodyEventPackage = {
      id_event_package: id,
      is_delete: isDelete,
    };

    this.eventPackageIsLoadingDelete$ = this.store.pipe(select(selectIsLoadingDeleteEventPackage));

    this.store.dispatch(
      fromEventPackageActions.deleteEventPackage({
        delete: bodyEventPackage,
      })
    );

    this.actions$
      .pipe(
        ofType(fromEventPackageActions.deleteEventPackageSuccess),
        takeUntil(this.unsubscribeEventPackage$)
      )
      .subscribe((result) => {
        const text = result.data.is_delete ? 'dihapus' : 'dipulihkan';

        Swal.fire({
          icon: 'success',
          text: `Paket Acara ${result.data.name} berhasil ${text}.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.filter.currentPage = 1;
          this.getAllEventPackage();
        });
      });

    this.actions$
      .pipe(
        ofType(fromEventPackageActions.deleteEventPackageFailure),
        takeUntil(this.unsubscribeEventPackage$)
      )
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'EventPackage');
      });
  }
}
