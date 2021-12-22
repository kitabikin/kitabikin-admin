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
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

// MODEL
import { ThemeCategoryData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';
import { ThemeCategoryService } from '@services';

// VALIDATOR
import { ThemeCategoryValidators } from '@validators';

// STORE
import {
  selectThemeCategory,
  selectIsLoadingUpdate as selectIsLoadingUpdateThemeCategory,
} from '@store/theme-category/theme-category.selectors';
import { fromThemeCategoryActions } from '@store/theme-category/theme-category.actions';

// PACKAGE
import { assign } from 'lodash';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kb-theme-category-edit',
  templateUrl: './theme-category-edit.component.html',
  styleUrls: ['./theme-category-edit.component.scss'],
})
export class ThemeCategoryEditComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Undangan', link: '/invitation' },
    { label: 'Kategori Tema', link: '/invitation/theme-category' },
    { label: 'Ubah', link: '/invitation/theme-category/edit' },
  ];

  // Variable
  id!: string;
  myForm!: FormGroup;

  // Data
  themeCategoryData$!: Observable<ThemeCategoryData | undefined>;
  themeCategoryIsLoadingUpdate$!: Observable<boolean>;

  private unsubscribeThemeCategory$ = new Subject<void>();

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private globalService: GlobalService,
    private translateService: TranslateService,
    private themeCategoryService: ThemeCategoryService,
    private actions$: Actions,
    private store: Store<any>,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.settingsAll();

    this.translateService.onLangChange.subscribe((event) => {
      this.settingsAll();
    });

    this.id = this.route.snapshot.params['id'];
  }

  settingsAll(): void {
    const word = ['theme-category', 'edit'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.edit} ${trans['theme-category']}`;
      this.description = `${trans.edit} ${trans['theme-category']}`;

      // Title & Description
      this.title = this.globalService.title;
      this.titleService.setTitle(`${this.label} | ${this.title}`);
      this.globalService.changeLabel(this.label);
      this.globalService.changeDescription(this.description);
    });
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      id_event: [null, [Validators.required]],
      code: [
        null,
        {
          validators: [Validators.required, Validators.maxLength(240)],
        },
      ],
      name: [null, [Validators.required, Validators.maxLength(240)]],
      description: [null],
      is_active: [false, [Validators.required]],
    });

    this.getThemeCategory();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeThemeCategory$.next();
    this.unsubscribeThemeCategory$.complete();
  }

  ngAfterViewInit(): void {}

  // GET =====================================================================================================
  getThemeCategory(): void {
    this.themeCategoryData$ = this.store.pipe(select(selectThemeCategory(this.id)));

    this.store
      .pipe(
        select(selectThemeCategory(this.id)),
        filter((val) => val !== undefined)
      )
      .subscribe((result) => {
        this.setFormThemeCategory(result);
      });
  }

  // SET FORM ================================================================================================
  setFormThemeCategory(data: ThemeCategoryData | undefined): void {
    this.myForm.patchValue({
      id_event: data?.id_event,
      code: data?.code,
      name: data?.name,
      description: data?.description,
      is_active: data?.is_active,
    });

    this.myForm.controls['code'].setAsyncValidators(
      ThemeCategoryValidators.checkExist(this.themeCategoryService, 'code', data?.code)
    );
  }

  // SAVE ====================================================================================================
  onSubmit(): void {
    const input = this.myForm.value;

    const bodyThemeCategory = input;

    assign(bodyThemeCategory, { id_theme_category: this.id });

    this.themeCategoryIsLoadingUpdate$ = this.store.pipe(select(selectIsLoadingUpdateThemeCategory));

    this.store.dispatch(
      fromThemeCategoryActions.updateThemeCategory({
        update: bodyThemeCategory,
      })
    );

    this.actions$
      .pipe(
        ofType(fromThemeCategoryActions.updateThemeCategorySuccess),
        takeUntil(this.unsubscribeThemeCategory$)
      )
      .subscribe((result) => {
        Swal.fire({
          icon: 'success',
          text: `Kategori Tema ${result.data.name} berhasil diubah.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.router.navigate(['/invitation/theme-category']);
        });
      });

    this.actions$
      .pipe(
        ofType(fromThemeCategoryActions.updateThemeCategoryFailure),
        takeUntil(this.unsubscribeThemeCategory$)
      )
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'ThemeCategory');
      });
  }
}
