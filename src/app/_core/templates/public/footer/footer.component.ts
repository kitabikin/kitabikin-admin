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
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

// SERVICE
import { GlobalService } from '@services';

// PACKAGE
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-public-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  moment: any = moment;

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private globalService: GlobalService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {}

  ngAfterViewInit(): void {}

  changeLanguage(language: string): void {
    this.translateService.use(language);
  }
}
