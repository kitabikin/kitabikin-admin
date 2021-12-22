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
import { ThemeFeatureData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';

// STORE
import { selectThemeFeature } from '@store/theme-feature/theme-feature.selectors';

// PACKAGE
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { faPen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'kb-theme-feature-detail',
  templateUrl: './theme-feature-detail.component.html',
  styleUrls: ['./theme-feature-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeFeatureDetailComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  faPen = faPen;

  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Undangan', link: '/invitation' },
    { label: 'Tema', link: '/invitation/theme' },
    { label: 'Fitur Tema', link: '/invitation/theme-feature/id' },
    { label: 'Detail', link: '/invitation/theme-feature/id/detail' },
  ];

  // Variable
  idTheme!: string;
  id!: string;

  // Data
  themeFeatureData$!: Observable<ThemeFeatureData | undefined>;

  private unsubscribeThemeFeature$ = new Subject<void>();

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

    this.idTheme = this.route.snapshot.params['id'];
    this.id = this.route.snapshot.params['id_theme_feature'];

    this.breadcrumb[2].link = `/invitation/theme-feature/${this.idTheme}`;
    this.breadcrumb[3].link = `/invitation/theme-feature/${this.idTheme}/detail`;
  }

  settingsAll(): void {
    const word = ['theme-feature', 'detail'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.detail} ${trans['theme-feature']}`;
      this.description = `${trans.detail} ${trans['theme-feature']}`;

      // Title & Description
      this.title = this.globalService.title;
      this.titleService.setTitle(`${this.label} | ${this.title}`);
      this.globalService.changeLabel(this.label);
      this.globalService.changeDescription(this.description);
    });
  }

  ngOnInit(): void {
    this.getThemeFeature();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeThemeFeature$.next();
    this.unsubscribeThemeFeature$.complete();
  }

  ngAfterViewInit(): void {}

  // GET =====================================================================================================
  getThemeFeature(): void {
    this.themeFeatureData$ = this.store.pipe(
      select(selectThemeFeature(this.id)),
      takeUntil(this.unsubscribeThemeFeature$)
    );
  }
}
