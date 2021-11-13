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
import { EventPackageService } from '@services';

// VALIDATOR
import { EventPackageValidators } from '@validators';

// STORE
import { selectIsLoadingCreate as selectIsLoadingCreateEventPackage } from '@store/event-package/event-package.selectors';
import { fromEventPackageActions } from '@store/event-package/event-package.actions';

// PACKAGE
import { assign } from 'lodash';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kb-event-package-add',
  templateUrl: './event-package-add.component.html',
  styleUrls: ['./event-package-add.component.scss'],
})
export class EventPackageAddComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Undangan', link: '/invitation' },
    { label: 'Paket Acara', link: '/invitation/event-package' },
    { label: 'Tambah', link: '/invitation/event-package/add' },
  ];

  // Variable
  myForm!: FormGroup;

  // Data
  eventPackageIsLoadingCreate$!: Observable<boolean>;

  private unsubscribeEventPackage$ = new Subject<void>();

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private globalService: GlobalService,
    private translateService: TranslateService,
    private eventPackageService: EventPackageService,
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
    const word = ['event-package', 'add'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.add} ${trans['event-package']}`;
      this.description = `${trans.add} ${trans['event-package']}`;

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
          asyncValidators: [EventPackageValidators.checkExist(this.eventPackageService, 'code')],
        },
      ],
      name: [null, [Validators.required, Validators.maxLength(240)]],
      description: [null],
      is_recommendation: [false, [Validators.required]],
      is_active: [false, [Validators.required]],
      event_price: this.fb.group({
        is_price: [false, [Validators.required]],
        price: [null],
        is_discount: [false, [Validators.required]],
        discount_type: [null],
        discount: [null],
      }),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeEventPackage$.next();
    this.unsubscribeEventPackage$.complete();
  }

  ngAfterViewInit(): void {}

  onSubmit(): void {
    const input = this.myForm.value;

    const bodyEventPackage = input;

    this.eventPackageIsLoadingCreate$ = this.store.pipe(select(selectIsLoadingCreateEventPackage));

    this.store.dispatch(
      fromEventPackageActions.createEventPackage({
        create: bodyEventPackage,
      })
    );

    this.actions$
      .pipe(
        ofType(fromEventPackageActions.createEventPackageSuccess),
        takeUntil(this.unsubscribeEventPackage$)
      )
      .subscribe((result) => {
        Swal.fire({
          icon: 'success',
          text: `Paket Acara ${result.data.name} berhasil ditambahkan.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.router.navigate(['/invitation/event-package']);
        });
      });

    this.actions$
      .pipe(
        ofType(fromEventPackageActions.createEventPackageFailure),
        takeUntil(this.unsubscribeEventPackage$)
      )
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'EventPackage');
      });
  }
}
