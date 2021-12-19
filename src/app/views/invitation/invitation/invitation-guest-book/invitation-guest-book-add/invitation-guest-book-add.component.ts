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
import { InvitationGuestBookService } from '@services';

// VALIDATOR
// import { InvitationValidators } from '@validators';

// STORE
import { selectIsLoadingCreate as selectIsLoadingCreateInvitationGuestBook } from '@store/invitation-guest-book/invitation-guest-book.selectors';
import { fromInvitationGuestBookActions } from '@store/invitation-guest-book/invitation-guest-book.actions';

// PACKAGE
import { assign, map } from 'lodash';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kb-invitation-guest-book-add',
  templateUrl: './invitation-guest-book-add.component.html',
  styleUrls: ['./invitation-guest-book-add.component.scss'],
})
export class InvitationGuestBookAddComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Undangan', link: '/invitation' },
    { label: 'Undangan', link: '/invitation/invitation' },
    { label: 'Buku Tamu', link: '/invitation/invitation/guest-book/id' },
    { label: 'Tambah', link: '/invitation/invitation/guest-book/id/add' },
  ];

  // Variable
  idInvitation!: string;
  myForm!: FormGroup;

  // Data
  invitationGuestBookIsLoadingCreate$!: Observable<boolean>;

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

    this.breadcrumb[2].link = `/invitation/invitation/guest-book/${this.idInvitation}`;
    this.breadcrumb[3].link = `/invitation/invitation/guest-book/${this.idInvitation}/add`;
  }

  settingsAll(): void {
    const word = ['invitation', 'guest-book', 'add'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.add} ${trans['guest-book']} ${trans['invitation']}`;
      this.description = `${trans.add} ${trans['guest-book']} ${trans['invitation']}`;

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
      is_active: [true, [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeInvitationGuestBook$.next();
    this.unsubscribeInvitationGuestBook$.complete();
  }

  ngAfterViewInit(): void {}

  onSubmit(): void {
    const input = this.myForm.value;

    const bodyInvitationGuestBook = input;

    this.invitationGuestBookIsLoadingCreate$ = this.store.pipe(
      select(selectIsLoadingCreateInvitationGuestBook)
    );

    this.store.dispatch(
      fromInvitationGuestBookActions.createInvitationGuestBook({
        create: bodyInvitationGuestBook,
      })
    );

    this.actions$
      .pipe(
        ofType(fromInvitationGuestBookActions.createInvitationGuestBookSuccess),
        takeUntil(this.unsubscribeInvitationGuestBook$)
      )
      .subscribe((result) => {
        Swal.fire({
          icon: 'success',
          text: `Buku Tamu ${result.data.name} berhasil ditambahkan.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.router.navigate(['/invitation/invitation/guest-book/', this.idInvitation]);
        });
      });

    this.actions$
      .pipe(
        ofType(fromInvitationGuestBookActions.createInvitationGuestBookFailure),
        takeUntil(this.unsubscribeInvitationGuestBook$)
      )
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'Invitation Guest Book');
      });
  }
}
