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
import { ThemeCategoryService } from '@services';

// VALIDATOR
import { ThemeCategoryValidators } from '@validators';

// STORE
import { selectIsLoadingCreate as selectIsLoadingCreateThemeCategory } from '@store/theme-category/theme-category.selectors';
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
  selector: 'kb-theme-category-add',
  templateUrl: './theme-category-add.component.html',
  styleUrls: ['./theme-category-add.component.scss'],
})
export class ThemeCategoryAddComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Undangan', link: '/invitation' },
    { label: 'Kategori Tema', link: '/invitation/theme-category' },
    { label: 'Tambah', link: '/invitation/theme-category/add' },
  ];

  // Variable
  myForm!: FormGroup;

  // Data
  themeCategoryIsLoadingCreate$!: Observable<boolean>;

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
  }

  settingsAll(): void {
    const word = ['theme-category', 'add'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.add} ${trans['theme-category']}`;
      this.description = `${trans.add} ${trans['theme-category']}`;

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
          asyncValidators: [ThemeCategoryValidators.checkExist(this.themeCategoryService, 'code')],
        },
      ],
      name: [null, [Validators.required, Validators.maxLength(240)]],
      description: [null],
      is_active: [false, [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeThemeCategory$.next();
    this.unsubscribeThemeCategory$.complete();
  }

  ngAfterViewInit(): void {}

  onSubmit(): void {
    const input = this.myForm.value;

    const bodyThemeCategory = input;

    this.themeCategoryIsLoadingCreate$ = this.store.pipe(select(selectIsLoadingCreateThemeCategory));

    this.store.dispatch(
      fromThemeCategoryActions.createThemeCategory({
        create: bodyThemeCategory,
      })
    );

    this.actions$
      .pipe(
        ofType(fromThemeCategoryActions.createThemeCategorySuccess),
        takeUntil(this.unsubscribeThemeCategory$)
      )
      .subscribe((result) => {
        Swal.fire({
          icon: 'success',
          text: `Kategori Tema ${result.data.name} berhasil ditambahkan.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.router.navigate(['/invitation/theme-category']);
        });
      });

    this.actions$
      .pipe(
        ofType(fromThemeCategoryActions.createThemeCategoryFailure),
        takeUntil(this.unsubscribeThemeCategory$)
      )
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'ThemeCategory');
      });
  }
}
