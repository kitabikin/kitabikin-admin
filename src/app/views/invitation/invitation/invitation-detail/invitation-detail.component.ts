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
import { InvitationData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';

// STORE
import { selectInvitation } from '@store/invitation/invitation.selectors';

// PACKAGE
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { faPen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'kb-invitation-detail',
  templateUrl: './invitation-detail.component.html',
  styleUrls: ['./invitation-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationDetailComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  faPen = faPen;

  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Undangan', link: '/invitation' },
    { label: 'Undangan', link: '/invitation/invitation' },
    { label: 'Detail', link: '/invitation/invitation/detail' },
  ];

  // Variable
  id!: string;

  // Data
  invitationData$!: Observable<InvitationData | undefined>;

  private unsubscribeInvitation$ = new Subject<void>();

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

    this.id = this.route.snapshot.params['id_invitation'];
  }

  settingsAll(): void {
    const word = ['invitation', 'detail'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.detail} ${trans['invitation']}`;
      this.description = `${trans.detail} ${trans['invitation']}`;

      // Title & Description
      this.title = this.globalService.title;
      this.titleService.setTitle(`${this.label} | ${this.title}`);
      this.globalService.changeLabel(this.label);
      this.globalService.changeDescription(this.description);
    });
  }

  ngOnInit(): void {
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
    this.invitationData$ = this.store.pipe(
      select(selectInvitation(this.id)),
      takeUntil(this.unsubscribeInvitation$)
    );
  }
}
