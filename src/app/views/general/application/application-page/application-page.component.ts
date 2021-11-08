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
import { Pagination, ApplicationData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';

// STORE
import {
  selectAllApplication,
  selectIsLoadingList as selectIsLoadingListApplication,
  selectIsLoadingDelete as selectIsLoadingDeleteApplication,
  selectError as selectErrorApplication,
  selectPagination as selectPaginationApplication,
} from '@store/application/application.selectors';
import { fromApplicationActions } from '@store/application/application.actions';

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
  selector: 'kb-application-page',
  templateUrl: './application-page.component.html',
  styleUrls: ['./application-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationPageComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
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
    { label: 'Pengaturan Umum', link: '/general' },
    { label: 'Aplikasi', link: '/application' },
  ];
  totalColumn = new Array(3);

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
    status_is_active: [],
  };

  // Data
  applicationData$!: Observable<ApplicationData[]>;
  applicationIsLoadingList$!: Observable<boolean>;
  applicationIsLoadingDelete$!: Observable<boolean>;
  applicationIsError$!: Observable<boolean>;
  applicationIsError = false;
  applicationErrorMessage!: string;
  applicationPagination$!: Observable<Pagination>;
  applicationPages: any;

  statusActiveData = [
    { value: true, label: 'Aktif', checked: false },
    { value: false, label: 'Arsip', checked: false },
  ];

  private unsubscribeApplication$ = new Subject<void>();

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
    const word = ['application', 'list'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = trans.application;
      this.description = `${trans.list} ${trans.application}`;

      // Title & Description
      this.title = this.globalService.title;
      this.titleService.setTitle(`${this.label} | ${this.title}`);
      this.globalService.changeLabel(this.label);
      this.globalService.changeDescription(this.description);
    });
  }

  ngOnInit(): void {
    this.getAllApplication();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeApplication$.next();
    this.unsubscribeApplication$.complete();
  }

  ngAfterViewInit(): void {}

  get checkFilter(): boolean {
    if (this.filter.search) {
      return true;
    }
    return false;
  }

  getAllApplication(): void {
    const pCurrent =
      Number(this.filter.perPage) * Number(this.filter.currentPage) - Number(this.filter.perPage);

    const pWhere: any[] = [
      {
        is_delete: false,
      },
    ];

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
    };

    if (this.filter.sort) {
      assign(params, { sort: `${this.filter.sort}:${this.filter.direction}` });
    } else {
      assign(params, { sort: 'modified_at:desc' });
    }

    this.store.dispatch(
      fromApplicationActions.loadAllApplication({
        params,
        pagination: true,
        infinite: false,
      })
    );

    this.store
      .pipe(
        select(selectErrorApplication),
        filter((val) => val !== null && val.error)
      )
      .subscribe((result) => {
        if (result.error) {
          this.toastr.error(result.message, 'Application');
        }
      });

    this.applicationIsLoadingList$ = this.store.pipe(select(selectIsLoadingListApplication));
    this.applicationPagination$ = this.store.pipe(select(selectPaginationApplication));

    this.applicationData$ = this.store.pipe(
      select(selectAllApplication),
      map((data: ApplicationData[]) => {
        return data.map((result: any) => new ApplicationData().deserialize(result));
      })
    );
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
    this.getAllApplication();
  }

  filterSearch(event: string): void {
    const value = isEmpty(event) === false ? event : '';
    if (this.filter.search !== value) {
      this.filter.search = value;
      this.filter.currentPage = 1;
      this.getAllApplication();
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
    this.getAllApplication();
  }

  filterStatusActive(event: any): void {
    this.filter.status_is_active = event;
    this.filter.currentPage = 1;
    this.getAllApplication();
  }

  onDelete(id: string | undefined, isDelete: boolean = true): void {
    const bodyApplication = {
      id,
      is_delete: isDelete,
    };

    this.applicationIsLoadingDelete$ = this.store.pipe(select(selectIsLoadingDeleteApplication));

    this.store.dispatch(
      fromApplicationActions.deleteApplication({
        delete: bodyApplication,
      })
    );

    this.actions$
      .pipe(ofType(fromApplicationActions.deleteApplicationSuccess), takeUntil(this.unsubscribeApplication$))
      .subscribe((result) => {
        const text = result.data.is_delete ? 'dihapus' : 'dipulihkan';

        Swal.fire({
          icon: 'success',
          text: `Aplikasi ${result.data.name} berhasil ${text}.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.filter.currentPage = 1;
          this.getAllApplication();
        });
      });

    this.actions$
      .pipe(ofType(fromApplicationActions.deleteApplicationFailure), takeUntil(this.unsubscribeApplication$))
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'Application');
      });
  }
}
