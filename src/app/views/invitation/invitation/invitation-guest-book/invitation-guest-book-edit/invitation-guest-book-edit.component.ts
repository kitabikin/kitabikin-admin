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
import { InvitationGuestBookData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';
import { InvitationGuestBookService } from '@services';

// STORE
import {
  selectInvitationGuestBook,
  selectIsLoadingUpdate as selectIsLoadingUpdateInvitationGuestBook,
} from '@store/invitation-guest-book/invitation-guest-book.selectors';
import { fromInvitationGuestBookActions } from '@store/invitation-guest-book/invitation-guest-book.actions';

// PACKAGE
import { assign } from 'lodash';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kb-invitation-guest-book-edit',
  templateUrl: './invitation-guest-book-edit.component.html',
  styleUrls: ['./invitation-guest-book-edit.component.scss'],
})
export class InvitationGuestBookEditComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Undangan', link: '/invitation' },
    { label: 'Undangan', link: '/invitation/invitation' },
    { label: 'Buku Tamu', link: '/invitation/invitation/guest-book/id' },
    { label: 'Ubah', link: '/invitation/invitation/guest-book/id/edit/id' },
  ];

  // Variable
  idInvitation!: string;
  id!: string;
  myForm!: FormGroup;

  // Data
  invitationGuestBookData$!: Observable<InvitationGuestBookData | undefined>;
  invitationGuestBookIsLoadingUpdate$!: Observable<boolean>;

  private unsubscribeInvitationGuestBook$ = new Subject<void>();

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private globalService: GlobalService,
    private translateService: TranslateService,
    private invitationGuestBookService: InvitationGuestBookService,
    private actions$: Actions,
    private store: Store<any>,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.settingsAll();

    this.translateService.onLangChange.subscribe((event) => {
      this.settingsAll();
    });

    this.idInvitation = this.route.snapshot.params['id_invitation'];
    this.id = this.route.snapshot.params['id_invitation_guest_book'];

    this.breadcrumb[2].link = `/invitation/invitation/guest-book/${this.idInvitation}`;
    this.breadcrumb[3].link = `/invitation/invitation/guest-book/${this.idInvitation}/edit/${this.id}`;
  }

  settingsAll(): void {
    const word = ['invitation', 'guest-book', 'edit'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.edit} ${trans['guest-book']} ${trans['invitation']}`;
      this.description = `${trans.edit} ${trans['guest-book']} ${trans['invitation']}`;

      // Title & Description
      this.title = this.globalService.title;
      this.titleService.setTitle(`${this.label} | ${this.title}`);
      this.globalService.changeLabel(this.label);
      this.globalService.changeDescription(this.description);
    });
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      id_invitation: [this.idInvitation, [Validators.required]],
      name: [null, [Validators.required, Validators.maxLength(240)]],
      address: [null, [Validators.required]],
      no_telp: [null, [Validators.required]],
      confirmation: [null, [Validators.required]],
      total_reservation: [null],
      is_active: [true, [Validators.required]],
    });

    this.getInvitationGuestBook();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeInvitationGuestBook$.next();
    this.unsubscribeInvitationGuestBook$.complete();
  }

  ngAfterViewInit(): void {}

  // GET =====================================================================================================
  getInvitationGuestBook(): void {
    this.invitationGuestBookData$ = this.store.pipe(select(selectInvitationGuestBook(this.id)));

    this.store
      .pipe(
        select(selectInvitationGuestBook(this.id)),
        filter((val) => val !== undefined)
      )
      .subscribe((result) => {
        this.setFormInvitationGuestBook(result);
      });
  }

  // SET FORM ================================================================================================
  setFormInvitationGuestBook(data: InvitationGuestBookData | undefined): void {
    this.myForm.patchValue({
      name: data?.name,
      address: data?.address,
      no_telp: data?.no_telp,
      confirmation: data?.confirmation,
      total_reservation: data?.total_reservation,
      is_active: data?.is_active,
    });
  }

  // SAVE ====================================================================================================
  onSubmit(): void {
    const input = this.myForm.value;

    const bodyInvitationGuestBook = input;

    assign(bodyInvitationGuestBook, { id_invitation_guest_book: this.id });

    this.invitationGuestBookIsLoadingUpdate$ = this.store.pipe(
      select(selectIsLoadingUpdateInvitationGuestBook)
    );

    this.store.dispatch(
      fromInvitationGuestBookActions.updateInvitationGuestBook({
        update: bodyInvitationGuestBook,
      })
    );

    this.actions$
      .pipe(
        ofType(fromInvitationGuestBookActions.updateInvitationGuestBookSuccess),
        takeUntil(this.unsubscribeInvitationGuestBook$)
      )
      .subscribe((result) => {
        Swal.fire({
          icon: 'success',
          text: `Buku Tamu ${result.data.name} berhasil diubah.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.router.navigate(['/invitation/invitation/guest-book/', this.idInvitation]);
        });
      });

    this.actions$
      .pipe(
        ofType(fromInvitationGuestBookActions.updateInvitationGuestBookFailure),
        takeUntil(this.unsubscribeInvitationGuestBook$)
      )
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'Invitation Guest Book');
      });
  }
}
