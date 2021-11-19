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
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

// MODEL
import { ThemeFeatureData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';
import { ThemeFeatureService } from '@services';

// VALIDATOR
import { ThemeFeatureValidators } from '@validators';

// STORE
import {
  selectThemeFeature,
  selectIsLoadingUpdate as selectIsLoadingUpdateThemeFeature,
} from '@store/theme-feature/theme-feature.selectors';
import { fromThemeFeatureActions } from '@store/theme-feature/theme-feature.actions';

// PACKAGE
import { assign, map, omit } from 'lodash';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kb-theme-feature-edit',
  templateUrl: './theme-feature-edit.component.html',
  styleUrls: ['./theme-feature-edit.component.scss'],
})
export class ThemeFeatureEditComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Pengaturan Umum', link: '/general' },
    { label: 'Tema', link: '/invitation/theme' },
    { label: 'Fitur Tema', link: '/invitation/theme-feature/id' },
    { label: 'Ubah', link: '/invitation/theme-feature/id/edit' },
  ];

  // Variable
  idTheme!: string;
  id!: string;
  myForm!: FormGroup;

  // Data
  themeFeatureData$!: Observable<ThemeFeatureData | undefined>;
  themeFeatureIsLoadingUpdate$!: Observable<boolean>;

  private unsubscribeThemeFeature$ = new Subject<void>();

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private globalService: GlobalService,
    private translateService: TranslateService,
    private themeFeatureService: ThemeFeatureService,
    private actions$: Actions,
    private store: Store<any>,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.settingsAll();

    this.translateService.onLangChange.subscribe((event) => {
      this.settingsAll();
    });

    this.idTheme = this.route.snapshot.params['id'];
    this.id = this.route.snapshot.params['id_theme_feature'];

    this.breadcrumb[2].link = `/invitation/theme-feature/${this.idTheme}`;
    this.breadcrumb[3].link = `/invitation/theme-feature/${this.idTheme}/detail`;
  }

  settingsAll(): void {
    const word = ['theme-feature', 'add'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.add} ${trans['theme-feature']}`;
      this.description = `${trans.add} ${trans['theme-feature']}`;

      // Title & Description
      this.title = this.globalService.title;
      this.titleService.setTitle(`${this.label} | ${this.title}`);
      this.globalService.changeLabel(this.label);
      this.globalService.changeDescription(this.description);
    });
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      code: [
        null,
        {
          validators: [Validators.required, Validators.maxLength(240)],
          asyncValidators: [ThemeFeatureValidators.checkExist(this.themeFeatureService, 'code')],
        },
      ],
      name: [null, [Validators.required, Validators.maxLength(240)]],
      order: [null],
      description: [null],
      is_active: [false, [Validators.required]],
      theme_feature_column: this.fb.array([]),
    });

    this.getThemeFeature();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeThemeFeature$.next();
    this.unsubscribeThemeFeature$.complete();
  }

  ngAfterViewInit(): void {}

  get themeFeature() {
    return this.myForm.controls['theme_feature_column'] as FormArray;
  }

  addThemeFeature() {
    const themeFeatureForm = this.fb.group({
      code: [null],
      label: [null],
      label_helper: [null],
      default_value: [null],
      configuration: ['{"form":"normal","type":"text"}'],
      order: [null],
      is_admin: [false],
    });
    this.themeFeature.push(themeFeatureForm);
  }

  deleteThemeFeature(themeFeatureIndex: any) {
    this.themeFeature.removeAt(themeFeatureIndex);
  }

  // GET =====================================================================================================
  getThemeFeature(): void {
    this.themeFeatureData$ = this.store.pipe(select(selectThemeFeature(this.id)));

    this.store
      .pipe(
        select(selectThemeFeature(this.id)),
        filter((val) => val !== undefined)
      )
      .subscribe((result) => {
        this.setFormThemeFeature(result);
      });
  }

  // SET FORM ================================================================================================
  setFormThemeFeature(data: ThemeFeatureData | undefined): void {
    this.myForm.patchValue({
      code: data?.code,
      name: data?.name,
      order: data?.order,
      description: data?.description,
      is_active: data?.is_active,
    });

    data?.theme_feature_column.map((item) => {
      const themeFeatureForm = this.fb.group({
        code: [item.code],
        label: [item.label],
        label_helper: [item.label_helper],
        default_value: [item.default_value],
        configuration: [JSON.stringify(item.configuration)],
        order: [item.order],
        is_admin: [item.is_admin],
      });
      this.themeFeature.push(themeFeatureForm);
    });

    this.myForm.controls['code'].setAsyncValidators(
      ThemeFeatureValidators.checkExist(this.themeFeatureService, 'code', data?.code)
    );
  }

  // SAVE ====================================================================================================
  onSubmit(): void {
    const input = this.myForm.value;

    const bodyThemeFeature = input;
    delete bodyThemeFeature.theme_code;

    assign(bodyThemeFeature, {
      id_theme_feature: this.id,
    });

    this.themeFeatureIsLoadingUpdate$ = this.store.pipe(select(selectIsLoadingUpdateThemeFeature));

    this.store.dispatch(
      fromThemeFeatureActions.updateThemeFeature({
        update: bodyThemeFeature,
      })
    );

    this.actions$
      .pipe(
        ofType(fromThemeFeatureActions.updateThemeFeatureSuccess),
        takeUntil(this.unsubscribeThemeFeature$)
      )
      .subscribe((result) => {
        Swal.fire({
          icon: 'success',
          text: `Fitur Tema ${result.data.name} berhasil diubah.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.router.navigate(['/invitation/theme-feature', this.idTheme]);
        });
      });

    this.actions$
      .pipe(
        ofType(fromThemeFeatureActions.updateThemeFeatureFailure),
        takeUntil(this.unsubscribeThemeFeature$)
      )
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'Theme Feature');
      });
  }
}
