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
import { Pagination, ThemeData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';

// STORE
import {
  selectAllTheme,
  selectIsLoadingList as selectIsLoadingListTheme,
  selectIsLoadingDelete as selectIsLoadingDeleteTheme,
  selectError as selectErrorTheme,
  selectPagination as selectPaginationTheme,
} from '@store/theme/theme.selectors';
import { fromThemeActions } from '@store/theme/theme.actions';

import { selectAllThemeCategory } from '@store/theme-category/theme-category.selectors';
import { fromThemeCategoryActions } from '@store/theme-category/theme-category.actions';

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
  selector: 'kb-theme-page',
  templateUrl: './theme-page.component.html',
  styleUrls: ['./theme-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemePageComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
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
    { label: 'Tema ', link: '/invitation/theme' },
  ];
  totalColumn = new Array(5);

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
    theme_category: [],
    event: [],
    status_is_active: [],
  };

  // Data
  themeData$!: Observable<ThemeData[]>;
  themeIsLoadingList$!: Observable<boolean>;
  themeIsLoadingDelete$!: Observable<boolean>;
  themeIsError$!: Observable<boolean>;
  themeIsError = false;
  themeErrorMessage!: string;
  themePagination$!: Observable<Pagination>;
  themePages: any;

  themeCategoryData!: any[];
  eventData!: any[];
  statusActiveData = [
    { value: true, label: 'Aktif', checked: false },
    { value: false, label: 'Arsip', checked: false },
  ];

  private unsubscribeTheme$ = new Subject<void>();

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
    const word = ['theme', 'list'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = trans['theme'];
      this.description = `${trans.list} ${trans['theme']}`;

      // Title & Description
      this.title = this.globalService.title;
      this.titleService.setTitle(`${this.label} | ${this.title}`);
      this.globalService.changeLabel(this.label);
      this.globalService.changeDescription(this.description);
    });
  }

  ngOnInit(): void {
    this.getAllTheme();
    this.getAllThemeCategory();
    this.getAllEvent();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeTheme$.next();
    this.unsubscribeTheme$.complete();
  }

  ngAfterViewInit(): void {}

  get checkFilter(): boolean {
    if (this.filter.search) {
      return true;
    }
    return false;
  }

  getAllTheme(): void {
    const pCurrent =
      Number(this.filter.perPage) * Number(this.filter.currentPage) - Number(this.filter.perPage);

    const pWhere: any[] = [
      {
        is_delete: false,
      },
    ];

    if (this.filter.theme_category) {
      pWhere.push({
        id_theme_category: this.filter.theme_category,
      });
    }

    if (this.filter.event) {
      pWhere.push({
        ['event:id_event']: this.filter.event,
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
      with: [{ theme_category: true }, { event: true }],
    };

    if (this.filter.sort) {
      assign(params, { sort: `${this.filter.sort}:${this.filter.direction}` });
    } else {
      assign(params, { sort: 'modified_at:desc' });
    }

    this.store.dispatch(
      fromThemeActions.loadAllTheme({
        params,
        pagination: true,
        infinite: false,
      })
    );

    this.store
      .pipe(
        select(selectErrorTheme),
        filter((val) => val !== null && val.error)
      )
      .subscribe((result) => {
        if (result.error) {
          this.toastr.error(result.message, 'Theme');
        }
      });

    this.themeIsLoadingList$ = this.store.pipe(select(selectIsLoadingListTheme));
    this.themePagination$ = this.store.pipe(select(selectPaginationTheme));

    this.themeData$ = this.store.pipe(
      select(selectAllTheme),
      map((data: ThemeData[]) => {
        return data.map((result: any) => new ThemeData().deserialize(result));
      })
    );
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
    this.getAllTheme();
  }

  filterSearch(event: string): void {
    const value = isEmpty(event) === false ? event : '';
    if (this.filter.search !== value) {
      this.filter.search = value;
      this.filter.currentPage = 1;
      this.getAllTheme();
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
    this.getAllTheme();
  }

  filterThemeCategory(event: any): void {
    this.filter.theme_category = event;
    this.filter.currentPage = 1;
    this.getAllTheme();
  }

  filterEvent(event: any): void {
    this.filter.event = event;
    this.filter.currentPage = 1;
    this.getAllTheme();
  }

  filterStatusActive(event: any): void {
    this.filter.status_is_active = event;
    this.filter.currentPage = 1;
    this.getAllTheme();
  }

  onDelete(id: string | undefined, isDelete: boolean = true): void {
    const bodyTheme = {
      id_theme: id,
      is_delete: isDelete,
    };

    this.themeIsLoadingDelete$ = this.store.pipe(select(selectIsLoadingDeleteTheme));

    this.store.dispatch(
      fromThemeActions.deleteTheme({
        delete: bodyTheme,
      })
    );

    this.actions$
      .pipe(ofType(fromThemeActions.deleteThemeSuccess), takeUntil(this.unsubscribeTheme$))
      .subscribe((result) => {
        const text = result.data.is_delete ? 'dihapus' : 'dipulihkan';

        Swal.fire({
          icon: 'success',
          text: `Tema ${result.data.name} berhasil ${text}.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.filter.currentPage = 1;
          this.getAllTheme();
        });
      });

    this.actions$
      .pipe(ofType(fromThemeActions.deleteThemeFailure), takeUntil(this.unsubscribeTheme$))
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'Theme');
      });
  }
}
