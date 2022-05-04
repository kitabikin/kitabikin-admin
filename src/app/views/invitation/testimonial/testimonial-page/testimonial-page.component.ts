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
import { Pagination, TestimonialData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';

// STORE
import {
  selectAllTestimonial,
  selectIsLoadingList as selectIsLoadingListTestimonial,
  selectIsLoadingDelete as selectIsLoadingDeleteTestimonial,
  selectError as selectErrorTestimonial,
  selectPagination as selectPaginationTestimonial,
} from '@store/testimonial/testimonial.selectors';
import { fromTestimonialActions } from '@store/testimonial/testimonial.actions';

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
  selector: 'kb-testimonial-page',
  templateUrl: './testimonial-page.component.html',
  styleUrls: ['./testimonial-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialPageComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
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
    { label: 'Testimoni', link: '/invitation/testimonial' },
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
    rate: [],
    status_is_active: [],
  };

  // Data
  testimonialData$!: Observable<TestimonialData[]>;
  testimonialIsLoadingList$!: Observable<boolean>;
  testimonialIsLoadingDelete$!: Observable<boolean>;
  testimonialIsError$!: Observable<boolean>;
  testimonialIsError = false;
  testimonialErrorMessage!: string;
  testimonialPagination$!: Observable<Pagination>;
  testimonialPages: any;

  statusActiveData = [
    { value: true, label: 'Aktif', checked: false },
    { value: false, label: 'Arsip', checked: false },
  ];
  rateData = [
    { value: 1, label: '1', checked: false },
    { value: 2, label: '2', checked: false },
    { value: 3, label: '3', checked: false },
    { value: 4, label: '4', checked: false },
    { value: 5, label: '5', checked: false },
  ];

  private unsubscribeTestimonial$ = new Subject<void>();

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
    const word = ['testimonial', 'list'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = trans.testimonial;
      this.description = `${trans.list} ${trans.testimonial}`;

      // Title & Description
      this.title = this.globalService.title;
      this.titleService.setTitle(`${this.label} | ${this.title}`);
      this.globalService.changeLabel(this.label);
      this.globalService.changeDescription(this.description);
    });
  }

  ngOnInit(): void {
    this.getAllTestimonial();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeTestimonial$.next();
    this.unsubscribeTestimonial$.complete();
  }

  ngAfterViewInit(): void {}

  get checkFilter(): boolean {
    if (this.filter.search) {
      return true;
    }
    return false;
  }

  getAllTestimonial(): void {
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

    if (this.filter.rate) {
      pWhere.push({
        rate: this.filter.rate,
      });
    }

    const params = {
      search: this.filter.search,
      limit: this.filter.perPage,
      start: pCurrent,
      where: pWhere,
      with: [{ user: true, profile: true }],
    };

    if (this.filter.sort) {
      assign(params, { sort: `${this.filter.sort}:${this.filter.direction}` });
    } else {
      assign(params, { sort: 'modified_at:desc' });
    }

    this.store.dispatch(
      fromTestimonialActions.loadAllTestimonial({
        params,
        pagination: true,
        infinite: false,
      })
    );

    this.store
      .pipe(
        select(selectErrorTestimonial),
        filter((val) => val !== null && val.error)
      )
      .subscribe((result) => {
        if (result.error) {
          this.toastr.error(result.message, 'Testimonial');
        }
      });

    this.testimonialIsLoadingList$ = this.store.pipe(select(selectIsLoadingListTestimonial));
    this.testimonialPagination$ = this.store.pipe(select(selectPaginationTestimonial));

    this.testimonialData$ = this.store.pipe(
      select(selectAllTestimonial),
      map((data: TestimonialData[]) => {
        return data.map((result: any) => new TestimonialData().deserialize(result));
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
    this.getAllTestimonial();
  }

  filterSearch(event: string): void {
    const value = isEmpty(event) === false ? event : '';
    if (this.filter.search !== value) {
      this.filter.search = value;
      this.filter.currentPage = 1;
      this.getAllTestimonial();
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
    this.getAllTestimonial();
  }

  filterStatusActive(event: any): void {
    this.filter.status_is_active = event;
    this.filter.currentPage = 1;
    this.getAllTestimonial();
  }

  filterRate(event: any): void {
    this.filter.rate = event;
    this.filter.currentPage = 1;
    this.getAllTestimonial();
  }

  onDelete(id: string | undefined, isDelete: boolean = true): void {
    const bodyTestimonial = {
      id_testimonial: id,
      is_delete: isDelete,
    };

    this.testimonialIsLoadingDelete$ = this.store.pipe(select(selectIsLoadingDeleteTestimonial));

    this.store.dispatch(
      fromTestimonialActions.deleteTestimonial({
        delete: bodyTestimonial,
      })
    );

    this.actions$
      .pipe(ofType(fromTestimonialActions.deleteTestimonialSuccess), takeUntil(this.unsubscribeTestimonial$))
      .subscribe((result) => {
        const text = result.data.is_delete ? 'dihapus' : 'dipulihkan';

        Swal.fire({
          icon: 'success',
          text: `Testimoni ${result.data.name} berhasil ${text}.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.filter.currentPage = 1;
          this.getAllTestimonial();
        });
      });

    this.actions$
      .pipe(ofType(fromTestimonialActions.deleteTestimonialFailure), takeUntil(this.unsubscribeTestimonial$))
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'Testimonial');
      });
  }
}
