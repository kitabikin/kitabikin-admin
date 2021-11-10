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
import { Pagination, UserData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';

// STORE
import {
  selectAllUser,
  selectIsLoadingList as selectIsLoadingListUser,
  selectIsLoadingDelete as selectIsLoadingDeleteUser,
  selectError as selectErrorUser,
  selectPagination as selectPaginationUser,
} from '@store/user/user.selectors';
import { fromUserActions } from '@store/user/user.actions';

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
  selector: 'kb-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPageComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
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
    { label: 'Pengguna', link: '/general/user' },
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
    status_is_active: [],
  };

  // Data
  userData$!: Observable<UserData[]>;
  userIsLoadingList$!: Observable<boolean>;
  userIsLoadingDelete$!: Observable<boolean>;
  userIsError$!: Observable<boolean>;
  userIsError = false;
  userErrorMessage!: string;
  userPagination$!: Observable<Pagination>;
  userPages: any;

  statusActiveData = [
    { value: true, label: 'Aktif', checked: false },
    { value: false, label: 'Arsip', checked: false },
  ];

  private unsubscribeUser$ = new Subject<void>();

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
    const word = ['user', 'list'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = trans.user;
      this.description = `${trans.list} ${trans.user}`;

      // Title & Description
      this.title = this.globalService.title;
      this.titleService.setTitle(`${this.label} | ${this.title}`);
      this.globalService.changeLabel(this.label);
      this.globalService.changeDescription(this.description);
    });
  }

  ngOnInit(): void {
    this.getAllUser();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeUser$.next();
    this.unsubscribeUser$.complete();
  }

  ngAfterViewInit(): void {}

  get checkFilter(): boolean {
    if (this.filter.search) {
      return true;
    }
    return false;
  }

  getAllUser(): void {
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
      fromUserActions.loadAllUser({
        params,
        pagination: true,
        infinite: false,
      })
    );

    this.store
      .pipe(
        select(selectErrorUser),
        filter((val) => val !== null && val.error)
      )
      .subscribe((result) => {
        if (result.error) {
          this.toastr.error(result.message, 'User');
        }
      });

    this.userIsLoadingList$ = this.store.pipe(select(selectIsLoadingListUser));
    this.userPagination$ = this.store.pipe(select(selectPaginationUser));

    this.userData$ = this.store.pipe(
      select(selectAllUser),
      map((data: UserData[]) => {
        return data.map((result: any) => new UserData().deserialize(result));
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
    this.getAllUser();
  }

  filterSearch(event: string): void {
    const value = isEmpty(event) === false ? event : '';
    if (this.filter.search !== value) {
      this.filter.search = value;
      this.filter.currentPage = 1;
      this.getAllUser();
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
    this.getAllUser();
  }

  filterStatusActive(event: any): void {
    this.filter.status_is_active = event;
    this.filter.currentPage = 1;
    this.getAllUser();
  }

  onDelete(id: string | undefined, isDelete: boolean = true): void {
    const bodyUser = {
      id_user: id,
      is_delete: isDelete,
    };

    this.userIsLoadingDelete$ = this.store.pipe(select(selectIsLoadingDeleteUser));

    this.store.dispatch(
      fromUserActions.deleteUser({
        delete: bodyUser,
      })
    );

    this.actions$
      .pipe(ofType(fromUserActions.deleteUserSuccess), takeUntil(this.unsubscribeUser$))
      .subscribe((result) => {
        const text = result.data.is_delete ? 'dihapus' : 'dipulihkan';

        Swal.fire({
          icon: 'success',
          text: `Pengguna ${result.data.profile.name} berhasil ${text}.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.filter.currentPage = 1;
          this.getAllUser();
        });
      });

    this.actions$
      .pipe(ofType(fromUserActions.deleteUserFailure), takeUntil(this.unsubscribeUser$))
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'User');
      });
  }
}
