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
import { Pagination, RoleData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';

// STORE
import {
  selectAllRole,
  selectIsLoadingList as selectIsLoadingListRole,
  selectIsLoadingDelete as selectIsLoadingDeleteRole,
  selectError as selectErrorRole,
  selectPagination as selectPaginationRole,
} from '@store/role/role.selectors';
import { fromRoleActions } from '@store/role/role.actions';

import { selectAllApplication } from '@store/application/application.selectors';
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
  selector: 'kb-role-page',
  templateUrl: './role-page.component.html',
  styleUrls: ['./role-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolePageComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
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
    { label: 'Peran', link: '/general/role' },
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
    application: [],
    status_is_active: [],
  };

  // Data
  roleData$!: Observable<RoleData[]>;
  roleIsLoadingList$!: Observable<boolean>;
  roleIsLoadingDelete$!: Observable<boolean>;
  roleIsError$!: Observable<boolean>;
  roleIsError = false;
  roleErrorMessage!: string;
  rolePagination$!: Observable<Pagination>;
  rolePages: any;

  applicationData!: any[];
  statusActiveData = [
    { value: true, label: 'Aktif', checked: false },
    { value: false, label: 'Arsip', checked: false },
  ];

  private unsubscribeRole$ = new Subject<void>();

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
    const word = ['role', 'list'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = trans.role;
      this.description = `${trans.list} ${trans.role}`;

      // Title & Description
      this.title = this.globalService.title;
      this.titleService.setTitle(`${this.label} | ${this.title}`);
      this.globalService.changeLabel(this.label);
      this.globalService.changeDescription(this.description);
    });
  }

  ngOnInit(): void {
    this.getAllRole();
    this.getAllApplication();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeRole$.next();
    this.unsubscribeRole$.complete();
  }

  ngAfterViewInit(): void {}

  get checkFilter(): boolean {
    if (this.filter.search) {
      return true;
    }
    return false;
  }

  getAllRole(): void {
    const pCurrent =
      Number(this.filter.perPage) * Number(this.filter.currentPage) - Number(this.filter.perPage);

    const pWhere: any[] = [
      {
        is_delete: false,
      },
    ];

    if (this.filter.application) {
      pWhere.push({
        id_application: this.filter.application,
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
    };

    if (this.filter.sort) {
      assign(params, { sort: `${this.filter.sort}:${this.filter.direction}` });
    } else {
      assign(params, { sort: 'modified_at:desc' });
    }

    this.store.dispatch(
      fromRoleActions.loadAllRole({
        params,
        pagination: true,
        infinite: false,
      })
    );

    this.store
      .pipe(
        select(selectErrorRole),
        filter((val) => val !== null && val.error)
      )
      .subscribe((result) => {
        if (result.error) {
          this.toastr.error(result.message, 'Role');
        }
      });

    this.roleIsLoadingList$ = this.store.pipe(select(selectIsLoadingListRole));
    this.rolePagination$ = this.store.pipe(select(selectPaginationRole));

    this.roleData$ = this.store.pipe(
      select(selectAllRole),
      map((data: RoleData[]) => {
        return data.map((result: any) => new RoleData().deserialize(result));
      })
    );
  }

  getAllApplication(): void {
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
      fromApplicationActions.loadAllApplication({
        params,
        pagination: false,
        infinite: false,
      })
    );

    this.store
      .pipe(
        select(selectAllApplication),
        filter((val) => val.length !== 0)
      )
      .subscribe((result) => {
        const options: any[] = [];
        result.map((res) => {
          options.push({
            value: res.id_application,
            label: res.name,
            checked: false,
          });
        });

        this.applicationData = options;
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
    this.getAllRole();
  }

  filterSearch(event: string): void {
    const value = isEmpty(event) === false ? event : '';
    if (this.filter.search !== value) {
      this.filter.search = value;
      this.filter.currentPage = 1;
      this.getAllRole();
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
    this.getAllRole();
  }

  filterApplication(event: any): void {
    this.filter.application = event;
    this.filter.currentPage = 1;
    this.getAllRole();
  }

  filterStatusActive(event: any): void {
    this.filter.status_is_active = event;
    this.filter.currentPage = 1;
    this.getAllRole();
  }

  onDelete(id: string | undefined, isDelete: boolean = true): void {
    const bodyRole = {
      id,
      is_delete: isDelete,
    };

    this.roleIsLoadingDelete$ = this.store.pipe(select(selectIsLoadingDeleteRole));

    this.store.dispatch(
      fromRoleActions.deleteRole({
        delete: bodyRole,
      })
    );

    this.actions$
      .pipe(ofType(fromRoleActions.deleteRoleSuccess), takeUntil(this.unsubscribeRole$))
      .subscribe((result) => {
        const text = result.data.is_delete ? 'dihapus' : 'dipulihkan';

        Swal.fire({
          icon: 'success',
          text: `Peran ${result.data.name} berhasil ${text}.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.filter.currentPage = 1;
          this.getAllRole();
        });
      });

    this.actions$
      .pipe(ofType(fromRoleActions.deleteRoleFailure), takeUntil(this.unsubscribeRole$))
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'Role');
      });
  }
}
