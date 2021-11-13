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
import { EventPackageData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';
import { EventPackageService } from '@services';

// VALIDATOR
import { EventPackageValidators } from '@validators';

// STORE
import {
  selectEventPackage,
  selectIsLoadingUpdate as selectIsLoadingUpdateEventPackage,
} from '@store/event-package/event-package.selectors';
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
  selector: 'kb-event-package-edit',
  templateUrl: './event-package-edit.component.html',
  styleUrls: ['./event-package-edit.component.scss'],
})
export class EventPackageEditComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Undangan', link: '/invitation' },
    { label: 'Paket Acara', link: '/invitation/event-package' },
    { label: 'Ubah', link: '/invitation/event-package/edit' },
  ];

  // Variable
  id!: string;
  myForm!: FormGroup;

  // Data
  eventPackageData$!: Observable<EventPackageData | undefined>;
  eventPackageIsLoadingUpdate$!: Observable<boolean>;

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

    this.id = this.route.snapshot.params['id'];
  }

  settingsAll(): void {
    const word = ['event-package', 'edit'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.edit} ${trans['event-package']}`;
      this.description = `${trans.edit} ${trans['event-package']}`;

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

    this.getEventPackage();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeEventPackage$.next();
    this.unsubscribeEventPackage$.complete();
  }

  ngAfterViewInit(): void {}

  // GET =====================================================================================================
  getEventPackage(): void {
    this.eventPackageData$ = this.store.pipe(select(selectEventPackage(this.id)));

    this.store
      .pipe(
        select(selectEventPackage(this.id)),
        filter((val) => val !== undefined)
      )
      .subscribe((result) => {
        this.setFormEventPackage(result);
      });
  }

  // SET FORM ================================================================================================
  setFormEventPackage(data: EventPackageData | undefined): void {
    this.myForm.patchValue({
      id_event: data?.id_event,
      code: data?.code,
      name: data?.name,
      description: data?.description,
      is_recommendation: data?.is_recommendation,
      is_active: data?.is_active,
      event_price: {
        is_price: data?.event_price?.is_price,
        price: data?.event_price?.price,
        is_discount: data?.event_price?.is_discount,
        discount_type: data?.event_price?.discount_type,
        discount: data?.event_price?.discount,
      },
    });

    this.myForm.controls['code'].setAsyncValidators(
      EventPackageValidators.checkExist(this.eventPackageService, 'code', data?.code)
    );
  }

  // SAVE ====================================================================================================
  onSubmit(): void {
    const input = this.myForm.value;

    const bodyEventPackage = input;

    assign(bodyEventPackage, { id_event_package: this.id });

    this.eventPackageIsLoadingUpdate$ = this.store.pipe(select(selectIsLoadingUpdateEventPackage));

    this.store.dispatch(
      fromEventPackageActions.updateEventPackage({
        update: bodyEventPackage,
      })
    );

    this.actions$
      .pipe(
        ofType(fromEventPackageActions.updateEventPackageSuccess),
        takeUntil(this.unsubscribeEventPackage$)
      )
      .subscribe((result) => {
        Swal.fire({
          icon: 'success',
          text: `Paket Acara ${result.data.name} berhasil diubah.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.router.navigate(['/invitation/event-package']);
        });
      });

    this.actions$
      .pipe(
        ofType(fromEventPackageActions.updateEventPackageFailure),
        takeUntil(this.unsubscribeEventPackage$)
      )
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'EventPackage');
      });
  }
}
