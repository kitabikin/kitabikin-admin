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
import { takeUntil } from 'rxjs/operators';

// SERVICE
import { GlobalService } from '@services/private';
import { ApplicationService } from '@services';

// VALIDATOR
import { ApplicationValidators } from '@validators';

// STORE
import { selectIsLoadingCreate as selectIsLoadingCreateApplication } from '@store/application/application.selectors';
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
  selector: 'kb-application-add',
  templateUrl: './application-add.component.html',
  styleUrls: ['./application-add.component.scss'],
})
export class ApplicationAddComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Pengaturan Umum', link: '/general' },
    { label: 'Aplikasi', link: '/general/application' },
    { label: 'Tambah', link: '/general/application/add' },
  ];

  // Variable
  myForm!: FormGroup;

  // Data
  applicationIsLoadingCreate$!: Observable<boolean>;

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
  }

  settingsAll(): void {
    const word = ['application', 'add'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.add} ${trans.application}`;
      this.description = `${trans.add} ${trans.application}`;

      // Title & Description
      this.title = this.globalService.title;
      this.titleService.setTitle(`${this.label} | ${this.title}`);
      this.globalService.changeLabel(this.label);
      this.globalService.changeDescription(this.description);
    });
  }

  ngOnInit(): void {
    this.myForm = new FormGroup({
      code: new FormControl(
        { value: null, disabled: false },
        {
          validators: [Validators.required, Validators.maxLength(240)],
          asyncValidators: ApplicationValidators.checkExist(this.applicationService, 'code'),
        }
      ),
      name: new FormControl({ value: null, disabled: false }, [
        Validators.required,
        Validators.maxLength(240),
      ]),
      description: new FormControl({ value: null, disabled: false }),
      is_active: new FormControl({ value: false, disabled: false }, [Validators.required]),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeApplication$.next();
    this.unsubscribeApplication$.complete();
  }

  ngAfterViewInit(): void {}

  onSubmit(): void {
    const input = this.myForm.value;

    const bodyApplication = input;

    this.applicationIsLoadingCreate$ = this.store.pipe(select(selectIsLoadingCreateApplication));

    this.store.dispatch(
      fromApplicationActions.createApplication({
        create: bodyApplication,
      })
    );

    this.actions$
      .pipe(ofType(fromApplicationActions.createApplicationSuccess), takeUntil(this.unsubscribeApplication$))
      .subscribe((result) => {
        Swal.fire({
          icon: 'success',
          text: `Aplikasi ${result.data.name} berhasil ditambahkan.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.router.navigate(['/general/application']);
        });
      });

    this.actions$
      .pipe(ofType(fromApplicationActions.createApplicationFailure), takeUntil(this.unsubscribeApplication$))
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'Application');
      });
  }
}
