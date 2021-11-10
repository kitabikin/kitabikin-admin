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
import { UserData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';

// STORE
import { selectUser } from '@store/user/user.selectors';

// PACKAGE
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { faPen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'kb-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  faPen = faPen;

  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Pengaturan Umum', link: '/general' },
    { label: 'Pengguna', link: '/general/user' },
    { label: 'Detail', link: '/general/user/detail' },
  ];

  // Variable
  id!: string;

  // Data
  userData$!: Observable<UserData | undefined>;

  private unsubscribeUser$ = new Subject<void>();

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

    this.id = this.route.snapshot.params['id'];
  }

  settingsAll(): void {
    const word = ['user', 'detail'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.detail} ${trans.user}`;
      this.description = `${trans.detail} ${trans.user}`;

      // Title & Description
      this.title = this.globalService.title;
      this.titleService.setTitle(`${this.label} | ${this.title}`);
      this.globalService.changeLabel(this.label);
      this.globalService.changeDescription(this.description);
    });
  }

  ngOnInit(): void {
    this.getUser();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeUser$.next();
    this.unsubscribeUser$.complete();
  }

  ngAfterViewInit(): void {}

  // GET =====================================================================================================
  getUser(): void {
    this.userData$ = this.store.pipe(select(selectUser(this.id)), takeUntil(this.unsubscribeUser$));
  }
}
