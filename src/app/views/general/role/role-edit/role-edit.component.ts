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
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

// MODEL
import { RoleData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';
import { RoleService } from '@services';

// VALIDATOR
import { RoleValidators } from '@validators';

// STORE
import { selectRole, selectIsLoadingUpdate as selectIsLoadingUpdateRole } from '@store/role/role.selectors';
import { fromRoleActions } from '@store/role/role.actions';

// PACKAGE
import { assign } from 'lodash';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kb-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss'],
})
export class RoleEditComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Pengaturan Umum', link: '/general' },
    { label: 'Peran', link: '/general/role' },
    { label: 'Ubah', link: '/general/role/edit' },
  ];

  // Variable
  id!: string;
  myForm!: FormGroup;

  // Data
  roleData$!: Observable<RoleData | undefined>;
  roleIsLoadingUpdate$!: Observable<boolean>;

  private unsubscribeRole$ = new Subject<void>();

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private globalService: GlobalService,
    private translateService: TranslateService,
    private roleService: RoleService,
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
    const word = ['role', 'edit'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.edit} ${trans.role}`;
      this.description = `${trans.edit} ${trans.role}`;

      // Title & Description
      this.title = this.globalService.title;
      this.titleService.setTitle(`${this.label} | ${this.title}`);
      this.globalService.changeLabel(this.label);
      this.globalService.changeDescription(this.description);
    });
  }

  ngOnInit(): void {
    this.myForm = new FormGroup({
      id_application: new FormControl({ value: null, disabled: false }, [Validators.required]),
      code: new FormControl({ value: null, disabled: false }, [
        Validators.required,
        Validators.maxLength(240),
      ]),
      name: new FormControl({ value: null, disabled: false }, [
        Validators.required,
        Validators.maxLength(240),
      ]),
      description: new FormControl({ value: null, disabled: false }),
      is_active: new FormControl({ value: false, disabled: false }, [Validators.required]),
    });

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
    this.roleData$ = this.store.pipe(select(selectRole(this.id)));

    this.store
      .pipe(
        select(selectRole(this.id)),
        filter((val) => val !== undefined)
      )
      .subscribe((result) => {
        this.setFormRole(result);
      });
  }

  // SET FORM ================================================================================================
  setFormRole(data: RoleData | undefined): void {
    this.myForm.patchValue({
      id_application: data?.id_application,
      code: data?.code,
      name: data?.name,
      description: data?.description,
      is_active: data?.is_active,
    });

    this.myForm.controls['code'].setAsyncValidators(
      RoleValidators.checkExist(this.roleService, 'code', data?.code)
    );
  }

  // SAVE ====================================================================================================
  onSubmit(): void {
    const input = this.myForm.value;

    const bodyRole = input;

    assign(bodyRole, { id: this.id });

    this.roleIsLoadingUpdate$ = this.store.pipe(select(selectIsLoadingUpdateRole));

    this.store.dispatch(
      fromRoleActions.updateRole({
        update: bodyRole,
      })
    );

    this.actions$
      .pipe(ofType(fromRoleActions.updateRoleSuccess), takeUntil(this.unsubscribeRole$))
      .subscribe((result) => {
        Swal.fire({
          icon: 'success',
          text: `Peran ${result.data.name} berhasil diubah.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.router.navigate(['/general/role']);
        });
      });

    this.actions$
      .pipe(ofType(fromRoleActions.updateRoleFailure), takeUntil(this.unsubscribeRole$))
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'Role');
      });
  }
}
