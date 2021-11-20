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
import { filter, takeUntil } from 'rxjs/operators';

// SERVICE
import { GlobalService } from '@services/private';
import { ThemeFeatureService } from '@services';

// VALIDATOR
import { ThemeFeatureValidators } from '@validators';

// STORE
import { selectIsLoadingCreate as selectIsLoadingCreateThemeFeature } from '@store/theme-feature/theme-feature.selectors';
import { fromThemeFeatureActions } from '@store/theme-feature/theme-feature.actions';

// PACKAGE
import { assign, map } from 'lodash';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kb-theme-feature-add',
  templateUrl: './theme-feature-add.component.html',
  styleUrls: ['./theme-feature-add.component.scss'],
})
export class ThemeFeatureAddComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Undangan', link: '/invitation' },
    { label: 'Tema', link: '/invitation/theme' },
    { label: 'Fitur Tema', link: '/invitation/theme-feature/id' },
    { label: 'Tambah', link: '/invitation/theme-feature/id/add' },
  ];

  // Variable
  idTheme!: string;
  myForm!: FormGroup;

  // Data
  themeFeatureIsLoadingCreate$!: Observable<boolean>;

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
      theme_feature_mapping: this.fb.array([]),
    });
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

  get themeFeatureMapping() {
    return this.myForm.controls['theme_feature_mapping'] as FormArray;
  }

  addThemeFeatureMapping(event: any): any {
    this.themeFeatureMapping.clear();

    map(event, (result) => {
      const themeFeatureMappingForm = this.fb.group({
        id_theme: [this.idTheme],
        id_event_package: [result.id_event_package],
        is_active: [false],
      });

      this.themeFeatureMapping.push(themeFeatureMappingForm);
    });
  }

  onSubmit(): void {
    const input = this.myForm.value;

    const bodyThemeFeature = input;

    assign(bodyThemeFeature, {
      id_theme: this.idTheme,
    });

    this.themeFeatureIsLoadingCreate$ = this.store.pipe(select(selectIsLoadingCreateThemeFeature));

    this.store.dispatch(
      fromThemeFeatureActions.createThemeFeature({
        create: bodyThemeFeature,
      })
    );

    this.actions$
      .pipe(
        ofType(fromThemeFeatureActions.createThemeFeatureSuccess),
        takeUntil(this.unsubscribeThemeFeature$)
      )
      .subscribe((result) => {
        Swal.fire({
          icon: 'success',
          text: `Fitur Tema ${result.data.name} berhasil ditambahkan.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.router.navigate(['/invitation/theme-feature', this.idTheme]);
        });
      });

    this.actions$
      .pipe(
        ofType(fromThemeFeatureActions.createThemeFeatureFailure),
        takeUntil(this.unsubscribeThemeFeature$)
      )
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'ThemeFeature');
      });
  }
}
