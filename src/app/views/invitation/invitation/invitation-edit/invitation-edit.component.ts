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
import { InvitationData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';
import { InvitationService } from '@services';

// VALIDATOR
import { InvitationValidators } from '@validators';

// STORE
import {
  selectInvitation,
  selectIsLoadingUpdate as selectIsLoadingUpdateInvitation,
} from '@store/invitation/invitation.selectors';
import { fromInvitationActions } from '@store/invitation/invitation.actions';

// PACKAGE
import { assign } from 'lodash';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kb-invitation-edit',
  templateUrl: './invitation-edit.component.html',
  styleUrls: ['./invitation-edit.component.scss'],
})
export class InvitationEditComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Undangan', link: '/invitation' },
    { label: 'Undangan', link: '/invitation/invitation' },
    { label: 'Ubah', link: '/invitation/invitation/edit' },
  ];

  // Variable
  id!: string;
  myForm!: FormGroup;

  // Data
  invitationData$!: Observable<InvitationData | undefined>;
  invitationIsLoadingUpdate$!: Observable<boolean>;

  private unsubscribeInvitation$ = new Subject<void>();

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private globalService: GlobalService,
    private translateService: TranslateService,
    private invitationService: InvitationService,
    private actions$: Actions,
    private store: Store<any>,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.settingsAll();

    this.translateService.onLangChange.subscribe((event) => {
      this.settingsAll();
    });

    this.id = this.route.snapshot.params['id_invitation'];
  }

  settingsAll(): void {
    const word = ['invitation', 'edit'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.edit} ${trans['invitation']}`;
      this.description = `${trans.edit} ${trans['invitation']}`;

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
      id_event: [null, [Validators.required]],
      id_event_package: [null, [Validators.required]],
      id_theme_category: [null, [Validators.required]],
      id_theme: [null, [Validators.required]],
      code: [
        null,
        {
          validators: [Validators.required, Validators.maxLength(240)],
        },
      ],
      name: [null, [Validators.required, Validators.maxLength(240)]],
      invitation_at: [null, [Validators.required]],
      description: [null],
      is_active: [false, [Validators.required]],
    });

    this.getInvitation();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeInvitation$.next();
    this.unsubscribeInvitation$.complete();
  }

  ngAfterViewInit(): void {}

  // GET =====================================================================================================
  getInvitation(): void {
    this.invitationData$ = this.store.pipe(select(selectInvitation(this.id)));

    this.store
      .pipe(
        select(selectInvitation(this.id)),
        filter((val) => val !== undefined)
      )
      .subscribe((result) => {
        this.setFormInvitation(result);
      });
  }

  // SET FORM ================================================================================================
  setFormInvitation(data: InvitationData | undefined): void {
    this.myForm.patchValue({
      id_user: data?.id_user,
      id_event: data?.id_event,
      id_event_package: data?.id_event_package,
      id_theme_category: data?.id_theme_category,
      id_theme: data?.id_theme,
      code: data?.code,
      name: data?.name,
      invitation_at: {
        year: moment(data?.invitation_at).year(),
        month: moment(data?.invitation_at).month() + 1,
        day: moment(data?.invitation_at).date(),
      },
      description: data?.description,
      is_active: data?.is_active,
    });

    this.myForm.controls['code'].setAsyncValidators(
      InvitationValidators.checkExist(this.invitationService, 'code', data?.code)
    );
  }

  // SAVE ====================================================================================================
  onSubmit(): void {
    const input = this.myForm.value;

    const invitationAt = moment({
      year: input.invitation_at.year,
      month: input.invitation_at.month - 1,
      day: input.invitation_at.day,
    }).format('YYYY-MM-DD');

    const bodyInvitation = input;

    assign(bodyInvitation, { id_invitation: this.id, invitation_at: invitationAt });

    this.invitationIsLoadingUpdate$ = this.store.pipe(select(selectIsLoadingUpdateInvitation));

    this.store.dispatch(
      fromInvitationActions.updateInvitation({
        update: bodyInvitation,
      })
    );

    this.actions$
      .pipe(ofType(fromInvitationActions.updateInvitationSuccess), takeUntil(this.unsubscribeInvitation$))
      .subscribe((result) => {
        Swal.fire({
          icon: 'success',
          text: `Undangan ${result.data.name} berhasil diubah.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.router.navigate(['/invitation/invitation']);
        });
      });

    this.actions$
      .pipe(ofType(fromInvitationActions.updateInvitationFailure), takeUntil(this.unsubscribeInvitation$))
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'Invitation');
      });
  }
}
