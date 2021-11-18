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
import { ThemeData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';
import { ThemeService } from '@services';

// VALIDATOR
import { ThemeValidators } from '@validators';

// STORE
import {
  selectTheme,
  selectIsLoadingUpdate as selectIsLoadingUpdateTheme,
} from '@store/theme/theme.selectors';
import { fromThemeActions } from '@store/theme/theme.actions';

// PACKAGE
import { assign } from 'lodash';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kb-theme-edit',
  templateUrl: './theme-edit.component.html',
  styleUrls: ['./theme-edit.component.scss'],
})
export class ThemeEditComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Undangan', link: '/invitation' },
    { label: 'Tema', link: '/invitation/theme' },
    { label: 'Ubah', link: '/invitation/theme/edit' },
  ];

  // Variable
  id!: string;
  myForm!: FormGroup;

  // Data
  themeData$!: Observable<ThemeData | undefined>;
  themeIsLoadingUpdate$!: Observable<boolean>;

  private unsubscribeTheme$ = new Subject<void>();

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private globalService: GlobalService,
    private translateService: TranslateService,
    private themeService: ThemeService,
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
    const word = ['theme', 'edit'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.edit} ${trans['theme']}`;
      this.description = `${trans.edit} ${trans['theme']}`;

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
      id_theme_category: [null, [Validators.required]],
      code: [
        null,
        {
          validators: [Validators.required, Validators.maxLength(240)],
        },
      ],
      name: [null, [Validators.required, Validators.maxLength(240)]],
      image: [null],
      description: [null],
      is_active: [false, [Validators.required]],
    });

    this.getTheme();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeTheme$.next();
    this.unsubscribeTheme$.complete();
  }

  ngAfterViewInit(): void {}

  // GET =====================================================================================================
  getTheme(): void {
    this.themeData$ = this.store.pipe(select(selectTheme(this.id)));

    this.store
      .pipe(
        select(selectTheme(this.id)),
        filter((val) => val !== undefined)
      )
      .subscribe((result) => {
        this.setFormTheme(result);
      });
  }

  // SET FORM ================================================================================================
  setFormTheme(data: ThemeData | undefined): void {
    this.myForm.patchValue({
      id_event: data?.theme_category.event.id_event,
      id_theme_category: data?.id_theme_category,
      code: data?.code,
      name: data?.name,
      image: data?.image,
      description: data?.description,
      is_active: data?.is_active,
    });

    this.myForm.controls['code'].setAsyncValidators(
      ThemeValidators.checkExist(this.themeService, 'code', data?.code)
    );
  }

  // SAVE ====================================================================================================
  onSubmit(): void {
    const input = this.myForm.value;

    const bodyTheme = input;
    delete bodyTheme.id_event;

    assign(bodyTheme, { id_theme: this.id });

    this.themeIsLoadingUpdate$ = this.store.pipe(select(selectIsLoadingUpdateTheme));

    this.store.dispatch(
      fromThemeActions.updateTheme({
        update: bodyTheme,
      })
    );

    this.actions$
      .pipe(ofType(fromThemeActions.updateThemeSuccess), takeUntil(this.unsubscribeTheme$))
      .subscribe((result) => {
        Swal.fire({
          icon: 'success',
          text: `Tema ${result.data.name} berhasil diubah.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.router.navigate(['/invitation/theme']);
        });
      });

    this.actions$
      .pipe(ofType(fromThemeActions.updateThemeFailure), takeUntil(this.unsubscribeTheme$))
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'Theme');
      });
  }
}
