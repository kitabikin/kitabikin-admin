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
import { Pagination, InvitationData, InvitationGuestBookData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';

// STORE
import { selectInvitation } from '@store/invitation/invitation.selectors';

import {
  selectAllInvitationGuestBook,
  selectIsLoadingList as selectIsLoadingListInvitationGuestBook,
  selectIsLoadingDelete as selectIsLoadingDeleteInvitationGuestBook,
  selectError as selectErrorInvitationGuestBook,
  selectPagination as selectPaginationInvitationGuestBook,
} from '@store/invitation-guest-book/invitation-guest-book.selectors';
import { fromInvitationGuestBookActions } from '@store/invitation-guest-book/invitation-guest-book.actions';

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
  selector: 'kb-invitation-check-in-page',
  templateUrl: './invitation-check-in-page.component.html',
  styleUrls: ['./invitation-check-in-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationCheckInPageComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
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
    { label: 'Konfirmasi Kehadiran ', link: '/invitation/invitation/check-in/id' },
  ];
  totalColumn = new Array(5);

  // Variable
  idInvitation!: string;

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
    confirmation: [],
    type: [],
    status_is_send: [],
    status_is_checkin: [],
    status_is_active: [],
  };

  // Data
  invitationData$!: Observable<InvitationData | undefined>;

  invitationGuestBookData$!: Observable<InvitationGuestBookData[]>;
  invitationGuestBookIsLoadingList$!: Observable<boolean>;
  invitationGuestBookIsLoadingDelete$!: Observable<boolean>;
  invitationGuestBookIsError$!: Observable<boolean>;
  invitationGuestBookIsError = false;
  invitationGuestBookErrorMessage!: string;
  invitationGuestBookPagination$!: Observable<Pagination>;
  invitationGuestBookPages: any;

  typeData = [
    { value: 'biasa', label: 'Biasa', checked: false },
    { value: 'vip', label: 'VIP', checked: false },
  ];

  private unsubscribeInvitation$ = new Subject<void>();
  private unsubscribeInvitationGuestBook$ = new Subject<void>();

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

    this.idInvitation = this.route.snapshot.params['id_invitation'];
  }

  settingsAll(): void {
    const word = ['invitation', 'check-in', 'list'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans['check-in']} ${trans['invitation']}`;
      this.description = `${trans.list} ${trans['check-in']} ${trans['invitation']}`;

      // Title & Description
      this.title = this.globalService.title;
      this.titleService.setTitle(`${this.label} | ${this.title}`);
      this.globalService.changeLabel(this.label);
      this.globalService.changeDescription(this.description);
    });
  }

  ngOnInit(): void {
    this.getInvitation();
    this.getAllInvitationGuestBook();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeInvitationGuestBook$.next();
    this.unsubscribeInvitationGuestBook$.complete();
  }

  ngAfterViewInit(): void {}

  get checkFilter(): boolean {
    if (this.filter.search) {
      return true;
    }
    return false;
  }

  getInvitation(): void {
    this.invitationData$ = this.store.pipe(
      select(selectInvitation(this.idInvitation)),
      takeUntil(this.unsubscribeInvitation$)
    );
  }

  getAllInvitationGuestBook(): void {
    const pCurrent =
      Number(this.filter.perPage) * Number(this.filter.currentPage) - Number(this.filter.perPage);

    const pWhere: any[] = [
      {
        id_invitation: this.idInvitation,
      },
      {
        is_delete: false,
      },
      {
        is_checkin: true,
      },
    ];

    if (this.filter.type) {
      pWhere.push({
        type: this.filter.type,
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
      fromInvitationGuestBookActions.loadAllInvitationGuestBook({
        params,
        pagination: true,
        infinite: false,
      })
    );

    this.store
      .pipe(
        select(selectErrorInvitationGuestBook),
        filter((val) => val !== null && val.error)
      )
      .subscribe((result) => {
        if (result.error) {
          this.toastr.error(result.message, 'Invitation Guest Book');
        }
      });

    this.invitationGuestBookIsLoadingList$ = this.store.pipe(select(selectIsLoadingListInvitationGuestBook));
    this.invitationGuestBookPagination$ = this.store.pipe(select(selectPaginationInvitationGuestBook));

    this.invitationGuestBookData$ = this.store.pipe(
      select(selectAllInvitationGuestBook),
      map((data: InvitationGuestBookData[]) => {
        return data.map((result: any) => new InvitationGuestBookData().deserialize(result));
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
    this.getAllInvitationGuestBook();
  }

  filterSearch(event: string): void {
    const value = isEmpty(event) === false ? event : '';
    if (this.filter.search !== value) {
      this.filter.search = value;
      this.filter.currentPage = 1;
      this.getAllInvitationGuestBook();
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
    this.getAllInvitationGuestBook();
  }

  filterType(event: any): void {
    this.filter.type = event;
    this.filter.currentPage = 1;
    this.getAllInvitationGuestBook();
  }
}
