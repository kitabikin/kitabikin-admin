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
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

// MODEL
import { ApplicationData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';
import { ApplicationService } from '@services';

// VALIDATOR
import { ApplicationValidators } from '@validators';

// STORE
import {
  selectApplication,
  selectIsLoadingUpdate as selectIsLoadingUpdateApplication,
} from '@store/application/application.selectors';
import { fromApplicationActions } from '@store/application/application.actions';

// PACKAGE
import { assign } from 'lodash';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kb-application-edit',
  templateUrl: './application-edit.component.html',
  styleUrls: ['./application-edit.component.scss'],
})
export class ApplicationEditComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Pengaturan Umum', link: '/general' },
    { label: 'Aplikasi', link: '/general/application' },
    { label: 'Ubah', link: '/general/application/edit' },
  ];

  // Variable
  id!: string;
  myForm!: FormGroup;

  // Data
  applicationData$!: Observable<ApplicationData | undefined>;
  applicationIsLoadingUpdate$!: Observable<boolean>;

  private unsubscribeApplication$ = new Subject<void>();

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private globalService: GlobalService,
    private translateService: TranslateService,
    private applicationService: ApplicationService,
    private actions$: Actions,
    private store: Store<any>,
    private toastr: ToastrService
  ) {
    this.settingsAll();

    this.translateService.onLangChange.subscribe((event) => {
      this.settingsAll();
    });

    this.id = this.route.snapshot.params['id'];
  }

  settingsAll(): void {
    const word = ['application', 'edit'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.edit} ${trans.application}`;
      this.description = `${trans.edit} ${trans.application}`;

      // Title & Description
      this.title = this.globalService.title;
      this.titleService.setTitle(`${this.label} | ${this.title}`);
      this.globalService.changeLabel(this.label);
      this.globalService.changeDescription(this.description);
    });
  }

  ngOnInit(): void {
    this.myForm = new FormGroup({
      code: new FormControl({ value: null, disabled: false }, [
        Validators.required,
        Validators.maxLength(240),
      ]),
      name: new FormControl({ value: null, disabled: false }, [
        Validators.required,
        Validators.maxLength(240),
      ]),
      description: new FormControl({ value: null, disabled: false }),
      is_active: new FormControl({ value: false, disabled: false }, [Validators.required]),
    });

    this.getApplication();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeApplication$.next();
    this.unsubscribeApplication$.complete();
  }

  ngAfterViewInit(): void {}

  // GET =====================================================================================================
  getApplication(): void {
    this.applicationData$ = this.store.pipe(select(selectApplication(this.id)));

    this.store
      .pipe(
        select(selectApplication(this.id)),
        filter((val) => val !== undefined)
      )
      .subscribe((result) => {
        this.setFormApplication(result);
      });
  }

  // SET FORM ================================================================================================
  setFormApplication(data: ApplicationData | undefined): void {
    this.myForm.patchValue({
      code: data?.code,
      name: data?.name,
      description: data?.description,
      is_active: data?.is_active,
    });

    this.myForm.controls['code'].setAsyncValidators(
      ApplicationValidators.checkExist(this.applicationService, 'code', data?.code)
    );
  }

  // SAVE ====================================================================================================
  onSubmit(): void {
    const input = this.myForm.value;

    const bodyApplication = input;

    assign(bodyApplication, { id: this.id });

    this.applicationIsLoadingUpdate$ = this.store.pipe(select(selectIsLoadingUpdateApplication));

    this.store.dispatch(
      fromApplicationActions.updateApplication({
        update: bodyApplication,
      })
    );

    this.actions$
      .pipe(ofType(fromApplicationActions.updateApplicationSuccess), takeUntil(this.unsubscribeApplication$))
      .subscribe((result) => {
        Swal.fire({
          icon: 'success',
          text: `Aplikasi ${result.data.name} berhasil diubah.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.router.navigate(['/general/application']);
        });
      });

    this.actions$
      .pipe(ofType(fromApplicationActions.updateApplicationFailure), takeUntil(this.unsubscribeApplication$))
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'Application');
      });
  }
}
