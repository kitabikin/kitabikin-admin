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
import { ThemeCategoryData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';

// STORE
import { selectThemeCategory } from '@store/theme-category/theme-category.selectors';

// PACKAGE
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { faPen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'kb-theme-category-detail',
  templateUrl: './theme-category-detail.component.html',
  styleUrls: ['./theme-category-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeCategoryDetailComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  faPen = faPen;

  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Undangan', link: '/invitation' },
    { label: 'Kategori Tema', link: '/invitation/theme-category' },
    { label: 'Detail', link: '/invitation/theme-category/detail' },
  ];

  // Variable
  id!: string;

  // Data
  themeCategoryData$!: Observable<ThemeCategoryData | undefined>;

  private unsubscribeThemeCategory$ = new Subject<void>();

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
    const word = ['theme-category', 'detail'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.detail} ${trans['theme-category']}`;
      this.description = `${trans.detail} ${trans['theme-category']}`;

      // Title & Description
      this.title = this.globalService.title;
      this.titleService.setTitle(`${this.label} | ${this.title}`);
      this.globalService.changeLabel(this.label);
      this.globalService.changeDescription(this.description);
    });
  }

  ngOnInit(): void {
    this.getThemeCategory();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeThemeCategory$.next();
    this.unsubscribeThemeCategory$.complete();
  }

  ngAfterViewInit(): void {}

  // GET =====================================================================================================
  getThemeCategory(): void {
    this.themeCategoryData$ = this.store.pipe(
      select(selectThemeCategory(this.id)),
      takeUntil(this.unsubscribeThemeCategory$)
    );
  }
}
