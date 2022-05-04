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

// STORE
import { selectIsLoadingCreate as selectIsLoadingCreateTestimonial } from '@store/testimonial/testimonial.selectors';
import { fromTestimonialActions } from '@store/testimonial/testimonial.actions';

// PACKAGE
import { assign } from 'lodash';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kb-testimonial-add',
  templateUrl: './testimonial-add.component.html',
  styleUrls: ['./testimonial-add.component.scss'],
})
export class TestimonialAddComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Undangan', link: '/invitation' },
    { label: 'Testimoni', link: '/invitation/testimonial' },
    { label: 'Tambah', link: '/invitation/testimonial/add' },
  ];

  // Variable
  myForm!: FormGroup;

  // Data
  testimonialIsLoadingCreate$!: Observable<boolean>;

  private unsubscribeTestimonial$ = new Subject<void>();

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private globalService: GlobalService,
    private translateService: TranslateService,
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
    const word = ['testimonial', 'add'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.add} ${trans['testimonial']}`;
      this.description = `${trans.add} ${trans['testimonial']}`;

      // Title & Description
      this.title = this.globalService.title;
      this.titleService.setTitle(`${this.label} | ${this.title}`);
      this.globalService.changeLabel(this.label);
      this.globalService.changeDescription(this.description);
    });
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      id_user: [null, [Validators.required]],
      name: [null, [Validators.required, Validators.maxLength(240)]],
      rate: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      testimonial: [null, [Validators.required]],
      is_active: [false, [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeTestimonial$.next();
    this.unsubscribeTestimonial$.complete();
  }

  ngAfterViewInit(): void {}

  onSubmit(): void {
    const input = this.myForm.value;

    const bodyTestimonial = input;

    this.testimonialIsLoadingCreate$ = this.store.pipe(select(selectIsLoadingCreateTestimonial));

    this.store.dispatch(
      fromTestimonialActions.createTestimonial({
        create: bodyTestimonial,
      })
    );

    this.actions$
      .pipe(ofType(fromTestimonialActions.createTestimonialSuccess), takeUntil(this.unsubscribeTestimonial$))
      .subscribe((result) => {
        Swal.fire({
          icon: 'success',
          text: `Testimoni ${result.data.name} berhasil ditambahkan.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.router.navigate(['/invitation/testimonial']);
        });
      });

    this.actions$
      .pipe(ofType(fromTestimonialActions.createTestimonialFailure), takeUntil(this.unsubscribeTestimonial$))
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'Testimonial');
      });
  }
}
