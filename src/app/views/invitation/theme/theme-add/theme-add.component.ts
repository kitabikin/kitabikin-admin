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
import { takeUntil } from 'rxjs/operators';

// SERVICE
import { GlobalService } from '@services/private';
import { ThemeService } from '@services';

// VALIDATOR
import { ThemeValidators } from '@validators';

// STORE
import { selectIsLoadingCreate as selectIsLoadingCreateTheme } from '@store/theme/theme.selectors';
import { fromThemeActions } from '@store/theme/theme.actions';

// PACKAGE
import { assign, map } from 'lodash';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kb-theme-add',
  templateUrl: './theme-add.component.html',
  styleUrls: ['./theme-add.component.scss'],
})
export class ThemeAddComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Undangan', link: '/invitation' },
    { label: 'Tema', link: '/invitation/theme' },
    { label: 'Tambah', link: '/invitation/theme/add' },
  ];

  // Variable
  myForm!: FormGroup;

  // Data
  themeIsLoadingCreate$!: Observable<boolean>;

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
  }

  settingsAll(): void {
    const word = ['theme', 'add'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.add} ${trans['theme']}`;
      this.description = `${trans.add} ${trans['theme']}`;

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
          asyncValidators: [ThemeValidators.checkExist(this.themeService, 'code')],
        },
      ],
      name: [null, [Validators.required, Validators.maxLength(240)]],
      image: [null, [Validators.required]],
      description: [null],
      is_active: [false, [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeTheme$.next();
    this.unsubscribeTheme$.complete();
  }

  ngAfterViewInit(): void {}

  onSubmit(): void {
    const input = this.myForm.value;

    const bodyTheme = input;
    delete bodyTheme.id_event;

    this.themeIsLoadingCreate$ = this.store.pipe(select(selectIsLoadingCreateTheme));

    this.store.dispatch(
      fromThemeActions.createTheme({
        create: bodyTheme,
      })
    );

    this.actions$
      .pipe(ofType(fromThemeActions.createThemeSuccess), takeUntil(this.unsubscribeTheme$))
      .subscribe((result) => {
        Swal.fire({
          icon: 'success',
          text: `Tema ${result.data.name} berhasil ditambahkan.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.router.navigate(['/invitation/theme']);
        });
      });

    this.actions$
      .pipe(ofType(fromThemeActions.createThemeFailure), takeUntil(this.unsubscribeTheme$))
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'Theme');
      });
  }
}
