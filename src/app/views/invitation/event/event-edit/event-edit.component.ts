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
import { EventData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';
import { EventService } from '@services';

// VALIDATOR
import { EventValidators } from '@validators';

// STORE
import {
  selectEvent,
  selectIsLoadingUpdate as selectIsLoadingUpdateEvent,
} from '@store/event/event.selectors';
import { fromEventActions } from '@store/event/event.actions';

// PACKAGE
import { assign } from 'lodash';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kb-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss'],
})
export class EventEditComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Undangan', link: '/invitation' },
    { label: 'Acara', link: '/invitation/event' },
    { label: 'Ubah', link: '/invitation/event/edit' },
  ];

  // Variable
  id!: string;
  myForm!: FormGroup;

  // Data
  eventData$!: Observable<EventData | undefined>;
  eventIsLoadingUpdate$!: Observable<boolean>;

  private unsubscribeEvent$ = new Subject<void>();

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private globalService: GlobalService,
    private translateService: TranslateService,
    private eventService: EventService,
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
    const word = ['event', 'edit'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.edit} ${trans.event}`;
      this.description = `${trans.edit} ${trans.event}`;

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
        },
      ],
      name: [null, [Validators.required, Validators.maxLength(240)]],
      description: [null],
      is_active: [false, [Validators.required]],
    });

    this.getEvent();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeEvent$.next();
    this.unsubscribeEvent$.complete();
  }

  ngAfterViewInit(): void {}

  // GET =====================================================================================================
  getEvent(): void {
    this.eventData$ = this.store.pipe(select(selectEvent(this.id)));

    this.store
      .pipe(
        select(selectEvent(this.id)),
        filter((val) => val !== undefined)
      )
      .subscribe((result) => {
        this.setFormEvent(result);
      });
  }

  // SET FORM ================================================================================================
  setFormEvent(data: EventData | undefined): void {
    this.myForm.patchValue({
      code: data?.code,
      name: data?.name,
      description: data?.description,
      is_active: data?.is_active,
    });

    this.myForm.controls['code'].setAsyncValidators(
      EventValidators.checkExist(this.eventService, 'code', data?.code)
    );
  }

  // SAVE ====================================================================================================
  onSubmit(): void {
    const input = this.myForm.value;

    const bodyEvent = input;

    assign(bodyEvent, { id_event: this.id });

    this.eventIsLoadingUpdate$ = this.store.pipe(select(selectIsLoadingUpdateEvent));

    this.store.dispatch(
      fromEventActions.updateEvent({
        update: bodyEvent,
      })
    );

    this.actions$
      .pipe(ofType(fromEventActions.updateEventSuccess), takeUntil(this.unsubscribeEvent$))
      .subscribe((result) => {
        Swal.fire({
          icon: 'success',
          text: `Acara ${result.data.name} berhasil diubah.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.router.navigate(['/invitation/event']);
        });
      });

    this.actions$
      .pipe(ofType(fromEventActions.updateEventFailure), takeUntil(this.unsubscribeEvent$))
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'Event');
      });
  }
}
