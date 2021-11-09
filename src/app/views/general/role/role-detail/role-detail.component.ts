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
import { RoleData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';

// STORE
import { selectRole } from '@store/role/role.selectors';

// PACKAGE
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { faPen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'kb-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleDetailComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  faPen = faPen;

  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Pengaturan Umum', link: '/general' },
    { label: 'Peran', link: '/general/role' },
    { label: 'Detail', link: '/general/role/detail' },
  ];

  // Variable
  id!: string;

  // Data
  roleData$!: Observable<RoleData | undefined>;

  private unsubscribeRole$ = new Subject<void>();

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
    const word = ['role', 'detail'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.detail} ${trans.role}`;
      this.description = `${trans.detail} ${trans.role}`;

      // Title & Description
      this.title = this.globalService.title;
      this.titleService.setTitle(`${this.label} | ${this.title}`);
      this.globalService.changeLabel(this.label);
      this.globalService.changeDescription(this.description);
    });
  }

  ngOnInit(): void {
    this.getRole();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeRole$.next();
    this.unsubscribeRole$.complete();
  }

  ngAfterViewInit(): void {}

  // GET =====================================================================================================
  getRole(): void {
    this.roleData$ = this.store.pipe(select(selectRole(this.id)), takeUntil(this.unsubscribeRole$));
  }
}
