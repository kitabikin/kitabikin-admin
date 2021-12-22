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
import { Pagination, ThemeData, ThemeFeatureData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';

// STORE
import {
  selectAllThemeFeature,
  selectIsLoadingList as selectIsLoadingListThemeFeature,
  selectIsLoadingDelete as selectIsLoadingDeleteThemeFeature,
  selectError as selectErrorThemeFeature,
  selectPagination as selectPaginationThemeFeature,
} from '@store/theme-feature/theme-feature.selectors';
import { fromThemeFeatureActions } from '@store/theme-feature/theme-feature.actions';

import { selectTheme } from '@store/theme/theme.selectors';

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
  selector: 'kb-theme-feature-page',
  templateUrl: './theme-feature-page.component.html',
  styleUrls: ['./theme-feature-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeFeaturePageComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
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
    { label: 'Fitur Tema ', link: '/invitation/theme-feature' },
  ];
  totalColumn = new Array(3);

  // Variable
  idTheme!: string;

  // Data
  themeData$!: Observable<ThemeData | undefined>;

  themeFeatureData$!: Observable<ThemeFeatureData[]>;
  themeFeatureIsLoadingList$!: Observable<boolean>;
  themeFeatureIsLoadingDelete$!: Observable<boolean>;
  themeFeatureIsError$!: Observable<boolean>;
  themeFeatureIsError = false;
  themeFeatureErrorMessage!: string;

  statusActiveData = [
    { value: true, label: 'Aktif', checked: false },
    { value: false, label: 'Arsip', checked: false },
  ];

  private unsubscribeTheme$ = new Subject<void>();
  private unsubscribeThemeFeature$ = new Subject<void>();

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

    this.idTheme = this.route.snapshot.params['id'];
  }

  settingsAll(): void {
    const word = ['theme-feature', 'list'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = trans['theme-feature'];
      this.description = `${trans.list} ${trans['theme-feature']}`;

      // Title & Description
      this.title = this.globalService.title;
      this.titleService.setTitle(`${this.label} | ${this.title}`);
      this.globalService.changeLabel(this.label);
      this.globalService.changeDescription(this.description);
    });
  }

  ngOnInit(): void {
    this.getTheme();
    this.getAllThemeFeature();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeTheme$.next();
    this.unsubscribeTheme$.complete();

    this.unsubscribeThemeFeature$.next();
    this.unsubscribeThemeFeature$.complete();
  }

  ngAfterViewInit(): void {}

  getTheme(): void {
    this.themeData$ = this.store.pipe(select(selectTheme(this.idTheme)), takeUntil(this.unsubscribeTheme$));
  }

  getAllThemeFeature(): void {
    const pWhere: any[] = [
      {
        is_delete: false,
      },
      {
        id_theme: this.idTheme,
      },
    ];

    const params = {
      where: pWhere,
      with: [{ theme_feature_column: true }, { theme_feature_mapping: true }],
    };

    this.store.dispatch(
      fromThemeFeatureActions.loadAllThemeFeature({
        params,
        pagination: false,
        infinite: false,
      })
    );

    this.store
      .pipe(
        select(selectErrorThemeFeature),
        filter((val) => val !== null && val.error)
      )
      .subscribe((result) => {
        if (result.error) {
          this.toastr.error(result.message, 'Theme Feature');
        }
      });

    this.themeFeatureIsLoadingList$ = this.store.pipe(select(selectIsLoadingListThemeFeature));

    this.themeFeatureData$ = this.store.pipe(
      select(selectAllThemeFeature),
      map((data: ThemeFeatureData[]) => {
        return data.map((result: any) => new ThemeFeatureData().deserialize(result));
      })
    );
  }

  onDelete(id: string | undefined, isDelete: boolean = true): void {
    const bodyTheme = {
      id_theme_feature: id,
      is_delete: isDelete,
    };

    this.themeFeatureIsLoadingDelete$ = this.store.pipe(select(selectIsLoadingDeleteThemeFeature));

    this.store.dispatch(
      fromThemeFeatureActions.deleteThemeFeature({
        delete: bodyTheme,
      })
    );

    this.actions$
      .pipe(
        ofType(fromThemeFeatureActions.deleteThemeFeatureSuccess),
        takeUntil(this.unsubscribeThemeFeature$)
      )
      .subscribe((result) => {
        const text = result.data.is_delete ? 'dihapus' : 'dipulihkan';

        Swal.fire({
          icon: 'success',
          text: `Fitur Tema ${result.data.name} berhasil ${text}.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.getAllThemeFeature();
        });
      });

    this.actions$
      .pipe(
        ofType(fromThemeFeatureActions.deleteThemeFeatureFailure),
        takeUntil(this.unsubscribeThemeFeature$)
      )
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'Theme Feature');
      });
  }
}
