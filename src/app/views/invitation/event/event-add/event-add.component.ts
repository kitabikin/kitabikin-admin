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
import { EventService } from '@services';

// VALIDATOR
import { EventValidators } from '@validators';

// STORE
import { selectIsLoadingCreate as selectIsLoadingCreateEvent } from '@store/event/event.selectors';
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
  selector: 'kb-event-add',
  templateUrl: './event-add.component.html',
  styleUrls: ['./event-add.component.scss'],
})
export class EventAddComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Undangan', link: '/invitation' },
    { label: 'Acara', link: '/invitation/event' },
    { label: 'Tambah', link: '/invitation/event/add' },
  ];

  // Variable
  myForm!: FormGroup;

  // Data
  eventIsLoadingCreate$!: Observable<boolean>;

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
  }

  settingsAll(): void {
    const word = ['event', 'add'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.add} ${trans.event}`;
      this.description = `${trans.add} ${trans.event}`;

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
          asyncValidators: [EventValidators.checkExist(this.eventService, 'code')],
        },
      ],
      name: [null, [Validators.required, Validators.maxLength(240)]],
      description: [null],
      is_active: [false, [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeEvent$.next();
    this.unsubscribeEvent$.complete();
  }

  ngAfterViewInit(): void {}

  onSubmit(): void {
    const input = this.myForm.value;

    const bodyEvent = input;

    this.eventIsLoadingCreate$ = this.store.pipe(select(selectIsLoadingCreateEvent));

    this.store.dispatch(
      fromEventActions.createEvent({
        create: bodyEvent,
      })
    );

    this.actions$
      .pipe(ofType(fromEventActions.createEventSuccess), takeUntil(this.unsubscribeEvent$))
      .subscribe((result) => {
        Swal.fire({
          icon: 'success',
          text: `Acara ${result.data.name} berhasil ditambahkan.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.router.navigate(['/invitation/event']);
        });
      });

    this.actions$
      .pipe(ofType(fromEventActions.createEventFailure), takeUntil(this.unsubscribeEvent$))
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'Event');
      });
  }
}
