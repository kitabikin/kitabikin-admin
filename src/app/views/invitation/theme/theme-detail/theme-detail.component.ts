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
import { ThemeData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';

// STORE
import { selectTheme } from '@store/theme/theme.selectors';

// PACKAGE
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { faPen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'kb-theme-detail',
  templateUrl: './theme-detail.component.html',
  styleUrls: ['./theme-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeDetailComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  faPen = faPen;

  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Undangan', link: '/invitation' },
    { label: 'Tema', link: '/invitation/theme' },
    { label: 'Detail', link: '/invitation/theme/detail' },
  ];

  // Variable
  id!: string;

  // Data
  themeData$!: Observable<ThemeData | undefined>;

  private unsubscribeTheme$ = new Subject<void>();

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
    const word = ['theme', 'detail'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.detail} ${trans['theme']}`;
      this.description = `${trans.detail} ${trans['theme']}`;

      // Title & Description
      this.title = this.globalService.title;
      this.titleService.setTitle(`${this.label} | ${this.title}`);
      this.globalService.changeLabel(this.label);
      this.globalService.changeDescription(this.description);
    });
  }

  ngOnInit(): void {
    this.getTheme();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeTheme$.next();
    this.unsubscribeTheme$.complete();
  }

  ngAfterViewInit(): void {}

  // GET =====================================================================================================
  getTheme(): void {
    this.themeData$ = this.store.pipe(select(selectTheme(this.id)), takeUntil(this.unsubscribeTheme$));
  }
}
