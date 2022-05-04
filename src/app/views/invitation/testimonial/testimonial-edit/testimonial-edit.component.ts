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
import { TestimonialData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';

// STORE
import {
  selectTestimonial,
  selectIsLoadingUpdate as selectIsLoadingUpdateTestimonial,
} from '@store/testimonial/testimonial.selectors';
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
  selector: 'kb-testimonial-edit',
  templateUrl: './testimonial-edit.component.html',
  styleUrls: ['./testimonial-edit.component.scss'],
})
export class TestimonialEditComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Undangan', link: '/invitation' },
    { label: 'Testimoni', link: '/invitation/testimonial' },
    { label: 'Ubah', link: '/invitation/testimonial/edit' },
  ];

  // Variable
  id!: string;
  myForm!: FormGroup;

  // Data
  testimonialData$!: Observable<TestimonialData | undefined>;
  testimonialIsLoadingUpdate$!: Observable<boolean>;

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

    this.id = this.route.snapshot.params['id'];
  }

  settingsAll(): void {
    const word = ['testimonial', 'edit'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.edit} ${trans['testimonial']}`;
      this.description = `${trans.edit} ${trans['testimonial']}`;

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

    this.getTestimonial();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeTestimonial$.next();
    this.unsubscribeTestimonial$.complete();
  }

  ngAfterViewInit(): void {}

  // GET =====================================================================================================
  getTestimonial(): void {
    this.testimonialData$ = this.store.pipe(select(selectTestimonial(this.id)));

    this.store
      .pipe(
        select(selectTestimonial(this.id)),
        filter((val) => val !== undefined)
      )
      .subscribe((result) => {
        this.setFormTestimonial(result);
      });
  }

  // SET FORM ================================================================================================
  setFormTestimonial(data: TestimonialData | undefined): void {
    this.myForm.patchValue({
      id_user: data?.id_user,
      name: data?.name,
      rate: data?.rate,
      testimonial: data?.testimonial,
      is_active: data?.is_active,
    });
  }

  // SAVE ====================================================================================================
  onSubmit(): void {
    const input = this.myForm.value;

    const bodyTestimonial = input;

    assign(bodyTestimonial, { id_testimonial: this.id });

    this.testimonialIsLoadingUpdate$ = this.store.pipe(select(selectIsLoadingUpdateTestimonial));

    this.store.dispatch(
      fromTestimonialActions.updateTestimonial({
        update: bodyTestimonial,
      })
    );

    this.actions$
      .pipe(ofType(fromTestimonialActions.updateTestimonialSuccess), takeUntil(this.unsubscribeTestimonial$))
      .subscribe((result) => {
        Swal.fire({
          icon: 'success',
          text: `Testimoni ${result.data.name} berhasil diubah.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.router.navigate(['/invitation/testimonial']);
        });
      });

    this.actions$
      .pipe(ofType(fromTestimonialActions.updateTestimonialFailure), takeUntil(this.unsubscribeTestimonial$))
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'Testimonial');
      });
  }
}
