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
import { Title } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// MODEL
import { InvitationGuestBookData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';

// STORE
import { selectInvitationGuestBook } from '@store/invitation-guest-book/invitation-guest-book.selectors';

// PACKAGE
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { faPen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'kb-invitation-guest-book-detail',
  templateUrl: './invitation-guest-book-detail.component.html',
  styleUrls: ['./invitation-guest-book-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationGuestBookDetailComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  faPen = faPen;

  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Undangan', link: '/invitation' },
    { label: 'Undangan', link: '/invitation/invitation' },
    { label: 'Buku Tamu', link: '/invitation/invitation/guest-book/id' },
    { label: 'Detail', link: '/invitation/invitation/guest-book/id/edit/id' },
  ];

  // Variable
  idInvitation!: string;
  id!: string;

  // Data
  invitationGuestBookData$!: Observable<InvitationGuestBookData | undefined>;

  private unsubscribeInvitationGuestBook$ = new Subject<void>();

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private globalService: GlobalService,
    private translateService: TranslateService,
    private actions$: Actions,
    private store: Store<any>,
    private toastr: ToastrService
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
    const word = ['invitation', 'guest-book', 'detail'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.detail} ${trans['guest-book']} ${trans['invitation']}`;
      this.description = `${trans.detail} ${trans['guest-book']} ${trans['invitation']}`;

      // Title & Description
      this.title = this.globalService.title;
      this.titleService.setTitle(`${this.label} | ${this.title}`);
      this.globalService.changeLabel(this.label);
      this.globalService.changeDescription(this.description);
    });
  }

  ngOnInit(): void {
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
    this.invitationGuestBookData$ = this.store.pipe(
      select(selectInvitationGuestBook(this.id)),
      takeUntil(this.unsubscribeInvitationGuestBook$)
    );
  }
}
