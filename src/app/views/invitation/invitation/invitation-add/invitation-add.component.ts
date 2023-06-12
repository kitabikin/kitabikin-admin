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
import { InvitationService } from '@services';

// VALIDATOR
import { InvitationValidators } from '@validators';

// STORE
import { selectIsLoadingCreate as selectIsLoadingCreateInvitation } from '@store/invitation/invitation.selectors';
import { fromInvitationActions } from '@store/invitation/invitation.actions';

// PACKAGE
import { assign, map } from 'lodash';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kb-invitation-add',
  templateUrl: './invitation-add.component.html',
  styleUrls: ['./invitation-add.component.scss'],
})
export class InvitationAddComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Undangan', link: '/invitation' },
    { label: 'Undangan', link: '/invitation/invitation' },
    { label: 'Tambah', link: '/invitation/invitation/add' },
  ];

  // Variable
  myForm!: FormGroup;

  // Data
  invitationIsLoadingCreate$!: Observable<boolean>;

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
  }

  settingsAll(): void {
    const word = ['invitation', 'add'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.add} ${trans['invitation']}`;
      this.description = `${trans.add} ${trans['invitation']}`;

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
          asyncValidators: [InvitationValidators.checkExist(this.invitationService, 'code')],
        },
      ],
      name: [null, [Validators.required, Validators.maxLength(240)]],
      invitation_at: [null, [Validators.required]],
      description: [null],
      metadata: [null],
      is_active: [false, [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeInvitation$.next();
    this.unsubscribeInvitation$.complete();
  }

  ngAfterViewInit(): void {}

  onSubmit(): void {
    const input = this.myForm.value;

    const invitationAt = moment({
      year: input.invitation_at.year,
      month: input.invitation_at.month - 1,
      day: input.invitation_at.day,
    }).format('YYYY-MM-DD');

    const bodyInvitation = input;

    assign(bodyInvitation, { invitation_at: invitationAt });

    this.invitationIsLoadingCreate$ = this.store.pipe(select(selectIsLoadingCreateInvitation));

    this.store.dispatch(
      fromInvitationActions.createInvitation({
        create: bodyInvitation,
      })
    );

    this.actions$
      .pipe(ofType(fromInvitationActions.createInvitationSuccess), takeUntil(this.unsubscribeInvitation$))
      .subscribe((result) => {
        Swal.fire({
          icon: 'success',
          text: `Undangan ${result.data.name} berhasil ditambahkan.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.router.navigate(['/invitation/invitation']);
        });
      });

    this.actions$
      .pipe(ofType(fromInvitationActions.createInvitationFailure), takeUntil(this.unsubscribeInvitation$))
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'Invitation');
      });
  }
}
