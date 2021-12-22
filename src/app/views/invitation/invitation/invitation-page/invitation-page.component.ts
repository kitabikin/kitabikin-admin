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
import { Pagination, InvitationData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';

// STORE
import {
  selectAllInvitation,
  selectIsLoadingList as selectIsLoadingListInvitation,
  selectIsLoadingDelete as selectIsLoadingDeleteInvitation,
  selectError as selectErrorInvitation,
  selectPagination as selectPaginationInvitation,
} from '@store/invitation/invitation.selectors';
import { fromInvitationActions } from '@store/invitation/invitation.actions';

import { selectAllEvent } from '@store/event/event.selectors';
import { fromEventActions } from '@store/event/event.actions';

import { selectAllEventPackage } from '@store/event-package/event-package.selectors';
import { fromEventPackageActions } from '@store/event-package/event-package.actions';

import { selectAllThemeCategory } from '@store/theme-category/theme-category.selectors';
import { fromThemeCategoryActions } from '@store/theme-category/theme-category.actions';

import { selectAllTheme } from '@store/theme/theme.selectors';
import { fromThemeActions } from '@store/theme/theme.actions';

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
  selector: 'kb-invitation-page',
  templateUrl: './invitation-page.component.html',
  styleUrls: ['./invitation-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationPageComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
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
    { label: 'Undangan ', link: '/invitation/invitation' },
  ];
  totalColumn = new Array(10);

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
    event_package: [],
    theme_category: [],
    theme: [],
    status_is_active: [],
  };

  // Data
  invitationData$!: Observable<InvitationData[]>;
  invitationIsLoadingList$!: Observable<boolean>;
  invitationIsLoadingDelete$!: Observable<boolean>;
  invitationIsError$!: Observable<boolean>;
  invitationIsError = false;
  invitationErrorMessage!: string;
  invitationPagination$!: Observable<Pagination>;
  invitationPages: any;

  eventData!: any[];
  eventPackageData!: any[];
  themeCategoryData!: any[];
  themeData!: any[];
  statusActiveData = [
    { value: true, label: 'Aktif', checked: false },
    { value: false, label: 'Arsip', checked: false },
  ];

  private unsubscribeInvitation$ = new Subject<void>();

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
    const word = ['invitation', 'list'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = trans['invitation'];
      this.description = `${trans.list} ${trans['invitation']}`;

      // Title & Description
      this.title = this.globalService.title;
      this.titleService.setTitle(`${this.label} | ${this.title}`);
      this.globalService.changeLabel(this.label);
      this.globalService.changeDescription(this.description);
    });
  }

  ngOnInit(): void {
    this.getAllInvitation();
    this.getAllEvent();
    this.getAllEventPackage();
    this.getAllThemeCategory();
    this.getAllTheme();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeInvitation$.next();
    this.unsubscribeInvitation$.complete();
  }

  ngAfterViewInit(): void {}

  get checkFilter(): boolean {
    if (this.filter.search) {
      return true;
    }
    return false;
  }

  getAllInvitation(): void {
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

    if (this.filter.event_package) {
      pWhere.push({
        id_event_package: this.filter.event_package,
      });
    }

    if (this.filter.theme_category) {
      pWhere.push({
        id_theme_category: this.filter.theme_category,
      });
    }

    if (this.filter.theme) {
      pWhere.push({
        id_theme: this.filter.theme,
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
      with: [
        { user: true },
        { event: true },
        { event_package: true },
        { theme_category: true },
        { theme: true },
      ],
    };

    if (this.filter.sort) {
      assign(params, { sort: `${this.filter.sort}:${this.filter.direction}` });
    } else {
      assign(params, { sort: 'modified_at:desc' });
    }

    this.store.dispatch(
      fromInvitationActions.loadAllInvitation({
        params,
        pagination: true,
        infinite: false,
      })
    );

    this.store
      .pipe(
        select(selectErrorInvitation),
        filter((val) => val !== null && val.error)
      )
      .subscribe((result) => {
        if (result.error) {
          this.toastr.error(result.message, 'Invitation');
        }
      });

    this.invitationIsLoadingList$ = this.store.pipe(select(selectIsLoadingListInvitation));
    this.invitationPagination$ = this.store.pipe(select(selectPaginationInvitation));

    this.invitationData$ = this.store.pipe(
      select(selectAllInvitation),
      map((data: InvitationData[]) => {
        return data.map((result: any) => new InvitationData().deserialize(result));
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

  getAllEventPackage(): void {
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
      fromEventPackageActions.loadAllEventPackage({
        params,
        pagination: false,
        infinite: false,
      })
    );

    this.store
      .pipe(
        select(selectAllEventPackage),
        filter((val) => val.length !== 0)
      )
      .subscribe((result) => {
        const options: any[] = [];
        result.map((res) => {
          options.push({
            value: res.id_event_package,
            label: res.name,
            checked: false,
          });
        });

        this.eventPackageData = options;
      });
  }

  getAllThemeCategory(): void {
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
      fromThemeCategoryActions.loadAllThemeCategory({
        params,
        pagination: false,
        infinite: false,
      })
    );

    this.store
      .pipe(
        select(selectAllThemeCategory),
        filter((val) => val.length !== 0)
      )
      .subscribe((result) => {
        const options: any[] = [];
        result.map((res) => {
          options.push({
            value: res.id_theme_category,
            label: res.name,
            checked: false,
          });
        });

        this.themeCategoryData = options;
      });
  }

  getAllTheme(): void {
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
      fromThemeActions.loadAllTheme({
        params,
        pagination: false,
        infinite: false,
      })
    );

    this.store
      .pipe(
        select(selectAllTheme),
        filter((val) => val.length !== 0)
      )
      .subscribe((result) => {
        const options: any[] = [];
        result.map((res) => {
          options.push({
            value: res.id_theme,
            label: res.name,
            checked: false,
          });
        });

        this.themeData = options;
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
    this.getAllInvitation();
  }

  filterSearch(event: string): void {
    const value = isEmpty(event) === false ? event : '';
    if (this.filter.search !== value) {
      this.filter.search = value;
      this.filter.currentPage = 1;
      this.getAllInvitation();
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
    this.getAllInvitation();
  }

  filterEvent(event: any): void {
    this.filter.event = event;
    this.filter.currentPage = 1;
    this.getAllInvitation();
  }

  filterEventPackage(event: any): void {
    this.filter.event_package = event;
    this.filter.currentPage = 1;
    this.getAllInvitation();
  }

  filterThemeCategory(event: any): void {
    this.filter.theme_category = event;
    this.filter.currentPage = 1;
    this.getAllInvitation();
  }

  filterTheme(event: any): void {
    this.filter.theme = event;
    this.filter.currentPage = 1;
    this.getAllInvitation();
  }

  filterStatusActive(event: any): void {
    this.filter.status_is_active = event;
    this.filter.currentPage = 1;
    this.getAllInvitation();
  }

  onDelete(id: string | undefined, isDelete: boolean = true): void {
    const bodyInvitation = {
      id_invitation: id,
      is_delete: isDelete,
    };

    this.invitationIsLoadingDelete$ = this.store.pipe(select(selectIsLoadingDeleteInvitation));

    this.store.dispatch(
      fromInvitationActions.deleteInvitation({
        delete: bodyInvitation,
      })
    );

    this.actions$
      .pipe(ofType(fromInvitationActions.deleteInvitationSuccess), takeUntil(this.unsubscribeInvitation$))
      .subscribe((result) => {
        const text = result.data.is_delete ? 'dihapus' : 'dipulihkan';

        Swal.fire({
          icon: 'success',
          text: `Undangan ${result.data.name} berhasil ${text}.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.filter.currentPage = 1;
          this.getAllInvitation();
        });
      });

    this.actions$
      .pipe(ofType(fromInvitationActions.deleteInvitationFailure), takeUntil(this.unsubscribeInvitation$))
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'Invitation');
      });
  }
}
