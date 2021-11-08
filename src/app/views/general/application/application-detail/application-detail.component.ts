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
import { ApplicationData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';

// STORE
import { selectApplication } from '@store/application/application.selectors';

// PACKAGE
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { faPen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'kb-application-detail',
  templateUrl: './application-detail.component.html',
  styleUrls: ['./application-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationDetailComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  faPen = faPen;

  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Pengaturan Umum', link: '/general' },
    { label: 'Aplikasi', link: '/general/application' },
    { label: 'Detail', link: '/general/application/detail' },
  ];

  // Variable
  id!: string;

  // Data
  applicationData$!: Observable<ApplicationData | undefined>;

  private unsubscribeApplication$ = new Subject<void>();

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
    const word = ['application', 'detail'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.detail} ${trans.application}`;
      this.description = `${trans.detail} ${trans.application}`;

      // Title & Description
      this.title = this.globalService.title;
      this.titleService.setTitle(`${this.label} | ${this.title}`);
      this.globalService.changeLabel(this.label);
      this.globalService.changeDescription(this.description);
    });
  }

  ngOnInit(): void {
    this.getApplication();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeApplication$.next();
    this.unsubscribeApplication$.complete();
  }

  ngAfterViewInit(): void {}

  // GET =====================================================================================================
  getApplication(): void {
    this.applicationData$ = this.store.pipe(
      select(selectApplication(this.id)),
      takeUntil(this.unsubscribeApplication$)
    );
  }
}
