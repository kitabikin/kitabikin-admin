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
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil, filter, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { DataBase } from '@components/form/invitation/data/data-base';

// MODEL
import { Pagination, InvitationData, InvitationFeatureData, InvitationFeatureDataColumnData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';
import { InvitationFeatureService, InvitationFeatureDataColumnService } from '@services';
import { DataService } from '@components/form/invitation/data/data.service';

// STORE
import { selectInvitation } from '@store/invitation/invitation.selectors';

import {
  selectAllInvitationFeature,
  selectIsLoadingList as selectIsLoadingListInvitationFeature,
  selectIsLoadingDelete as selectIsLoadingDeleteInvitationFeature,
  selectError as selectErrorInvitationFeature,
  selectPagination as selectPaginationInvitationFeature,
} from '@store/invitation-feature/invitation-feature.selectors';
import { fromInvitationFeatureActions } from '@store/invitation-feature/invitation-feature.actions';

// PACKAGE
import { isEmpty, isEqual, assign, isArray, find, orderBy } from 'lodash';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { faSearchPlus, faPlus, faPen, faTrash, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'kb-invitation-data',
  templateUrl: './invitation-data.component.html',
  styleUrls: ['./invitation-data.component.scss'],
  providers: [DataService],
})
export class InvitationDataComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  faSearchPlus = faSearchPlus;
  faPlus = faPlus;
  faPen = faPen;
  faTrash = faTrash;
  faCalendarAlt = faCalendarAlt;

  env: any = environment;
  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Undangan', link: '/invitation' },
    { label: 'Undangan ', link: '/invitation/invitation' },
    { label: 'Data ', link: '/invitation/invitation/data/id' },
  ];

  // Variable
  id!: string;
  myForm!: FormGroup;
  myFormArray!: FormArray;

  // Data
  invitationData$!: Observable<InvitationData | undefined>;

  invitationFeatureData$!: Observable<InvitationFeatureData[]>;
  invitationFeatureIsLoadingList$!: Observable<boolean>;
  invitationFeatureIsLoadingDelete$!: Observable<boolean>;
  invitationFeatureIsError$!: Observable<boolean>;
  invitationFeatureIsError = false;
  invitationFeatureErrorMessage!: string;
  invitationFeaturePagination$!: Observable<Pagination>;
  invitationFeaturePages: any;

  invitationColumnData!: InvitationFeatureDataColumnData[];

  datas!: DataBase<any>[];
  datas$!: Observable<DataBase<any>[]>;

  private unsubscribeInvitation$ = new Subject<void>();
  private unsubscribeInvitationFeature$ = new Subject<void>();

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private globalService: GlobalService,
    private translateService: TranslateService,
    private invitationFeatureService: InvitationFeatureService,
    private invitationFeatureDataColumnService: InvitationFeatureDataColumnService,
    private dataService: DataService,
    private actions$: Actions,
    private store: Store<any>,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.settingsAll();

    this.translateService.onLangChange.subscribe((event) => {
      this.settingsAll();
    });

    this.id = this.route.snapshot.params['id_invitation'];
  }

  settingsAll(): void {
    const word = ['invitation', 'data'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.data} ${trans['invitation']}`;
      this.description = `${trans.data} ${trans['invitation']}`;

      // Title & Description
      this.title = this.globalService.title;
      this.titleService.setTitle(`${this.label} | ${this.title}`);
      this.globalService.changeLabel(this.label);
      this.globalService.changeDescription(this.description);
    });
  }

  ngOnInit(): void {
    this.getInvitation();
    this.getAllInvitationFeature();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {}

  ngAfterViewInit(): void {}

  getInvitation(): void {
    this.invitationData$ = this.store.pipe(
      select(selectInvitation(this.id)),
      takeUntil(this.unsubscribeInvitation$)
    );
  }

  getAllInvitationFeature(): void {
    // const pWhere: any[] = [{ ['theme_feature:is_admin']: false }];
    const pWhere: any[] = [];

    const params = {
      where: pWhere,
      with: [{ theme_feature: true }, { invitation_feature_data: true }],
      sort: 'theme_feature:asc',
    };

    this.store.dispatch(
      fromInvitationFeatureActions.loadAllInvitationFeature({
        params,
        pagination: false,
        infinite: false,
      })
    );

    this.store
      .pipe(
        select(selectErrorInvitationFeature),
        filter((val) => val !== null && val.error)
      )
      .subscribe((result) => {
        if (result.error) {
          this.toastr.error(result.message, 'Invitation Feature');
        }
      });

    this.invitationFeatureIsLoadingList$ = this.store.pipe(select(selectIsLoadingListInvitationFeature));

    this.store
      .pipe(
        select(selectAllInvitationFeature),
        filter((val) => val.length !== 0),
        map((data: InvitationFeatureData[]) => {
          return data.map((result: any) => new InvitationFeatureData().deserialize(result));
        })
      )
      .subscribe((result: InvitationFeatureData[]) => {
        this.invitationFeatureData$ = of(result);
        this.datas = this.dataService.getDatas(result);
        this.myForm = this.dataService.toForm(this.datas as DataBase<string>[]);
      });
  }
}
