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
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

// MODEL
import { UserData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';
import { UserService } from '@services';

// VALIDATOR
import { UserValidators } from '@validators';

// STORE
import { selectUser, selectIsLoadingUpdate as selectIsLoadingUpdateUser } from '@store/user/user.selectors';
import { fromUserActions } from '@store/user/user.actions';

// PACKAGE
import { assign, map, omit } from 'lodash';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kb-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Pengaturan Umum', link: '/general' },
    { label: 'Pengguna', link: '/general/user' },
    { label: 'Ubah', link: '/general/user/edit' },
  ];

  // Variable
  id!: string;
  myForm!: FormGroup;

  // Data
  userData$!: Observable<UserData | undefined>;
  userIsLoadingUpdate$!: Observable<boolean>;

  private unsubscribeUser$ = new Subject<void>();

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private globalService: GlobalService,
    private translateService: TranslateService,
    private userService: UserService,
    private actions$: Actions,
    private store: Store<any>,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.settingsAll();

    this.translateService.onLangChange.subscribe((event) => {
      this.settingsAll();
    });

    this.id = this.route.snapshot.params['id'];
  }

  settingsAll(): void {
    const word = ['user', 'edit'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.edit} ${trans.user}`;
      this.description = `${trans.edit} ${trans.user}`;

      // Title & Description
      this.title = this.globalService.title;
      this.titleService.setTitle(`${this.label} | ${this.title}`);
      this.globalService.changeLabel(this.label);
      this.globalService.changeDescription(this.description);
    });
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      profile: this.fb.group({
        id_profile: [null, [Validators.required]],
        name: [null, [Validators.required]],
      }),
      username: [
        null,
        {
          validators: [Validators.required, Validators.maxLength(240)],
        },
      ],
      password: [null],
      email: [
        null,
        {
          validators: [Validators.required],
        },
      ],
      signup_with: ['web'],
      is_email: [true],
      referral_code: [
        null,
        {
          validators: [Validators.required, Validators.maxLength(6)],
        },
      ],
      is_active: [false, [Validators.required]],
      role: this.fb.array([]),
    });

    this.getUser();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeUser$.next();
    this.unsubscribeUser$.complete();
  }

  ngAfterViewInit(): void {}

  get role() {
    return this.myForm.controls['role'] as FormArray;
  }

  addRole() {
    const roleForm = this.fb.group({
      id_application: [null, Validators.required],
      id_role: [null, Validators.required],
    });
    this.role.push(roleForm);
  }

  deleteRole(roleIndex: any) {
    this.role.removeAt(roleIndex);
  }

  // GET =====================================================================================================
  getUser(): void {
    this.userData$ = this.store.pipe(select(selectUser(this.id)));

    this.store
      .pipe(
        select(selectUser(this.id)),
        filter((val) => val !== undefined)
      )
      .subscribe((result) => {
        this.setFormUser(result);
      });
  }

  // SET FORM ================================================================================================
  setFormUser(data: UserData | undefined): void {
    this.myForm.patchValue({
      profile: {
        id_profile: data?.profile.id_profile,
        name: data?.profile.name,
      },
      username: data?.username,
      email: data?.email,
      referral_code: data?.referral_code,
      is_active: data?.is_active,
    });

    data?.role.map((item) => {
      const roleForm = this.fb.group({
        id_application: [item.application.id_application, Validators.required],
        id_role: [item.id_role, Validators.required],
      });
      this.role.push(roleForm);
    });

    this.myForm.controls['username'].setAsyncValidators(
      UserValidators.checkExist(this.userService, 'username', data?.username)
    );

    this.myForm.controls['email'].setAsyncValidators(
      UserValidators.checkExist(this.userService, 'email', data?.email)
    );

    this.myForm.controls['referral_code'].setAsyncValidators(
      UserValidators.checkExist(this.userService, 'referral_code', data?.referral_code)
    );
  }

  // SAVE ====================================================================================================
  onSubmit(): void {
    const input = this.myForm.value;

    const bodyUser = input;
    bodyUser.role = map(bodyUser.role, (o) => omit(o, ['id_application']));

    assign(bodyUser, { id_user: this.id });

    if (bodyUser.password === null) {
      delete bodyUser.password;
    }

    this.userIsLoadingUpdate$ = this.store.pipe(select(selectIsLoadingUpdateUser));

    this.store.dispatch(
      fromUserActions.updateUser({
        update: bodyUser,
      })
    );

    this.actions$
      .pipe(ofType(fromUserActions.updateUserSuccess), takeUntil(this.unsubscribeUser$))
      .subscribe((result) => {
        Swal.fire({
          icon: 'success',
          text: `Pengguna ${result.data.profile.name} berhasil diubah.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.router.navigate(['/general/user']);
        });
      });

    this.actions$
      .pipe(ofType(fromUserActions.updateUserFailure), takeUntil(this.unsubscribeUser$))
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'User');
      });
  }
}
