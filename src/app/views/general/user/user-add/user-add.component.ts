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
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// SERVICE
import { GlobalService } from '@services/private';
import { UserService } from '@services';

// VALIDATOR
import { UserValidators } from '@validators';

// STORE
import { selectIsLoadingCreate as selectIsLoadingCreateUser } from '@store/user/user.selectors';
import { fromUserActions } from '@store/user/user.actions';

// PACKAGE
import _, { assign } from 'lodash';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kb-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss'],
})
export class UserAddComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Pengaturan Umum', link: '/general' },
    { label: 'Pengguna', link: '/general/user' },
    { label: 'Tambah', link: '/general/user/add' },
  ];

  // Variable
  myForm!: FormGroup;

  // Data
  userIsLoadingCreate$!: Observable<boolean>;

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
  }

  settingsAll(): void {
    const word = ['user', 'add'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.add} ${trans.user}`;
      this.description = `${trans.add} ${trans.user}`;

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
        name: ['', [Validators.required]],
      }),
      username: [
        '',
        {
          validators: [Validators.required, Validators.maxLength(240)],
          asyncValidators: [UserValidators.checkExist(this.userService, 'username')],
        },
      ],
      password: ['', [Validators.required]],
      email: [
        '',
        {
          validators: [Validators.required],
          asyncValidators: [UserValidators.checkExist(this.userService, 'email')],
        },
      ],
      signup_with: ['web'],
      is_email: [true],
      referral_code: [
        '',
        {
          validators: [Validators.required, Validators.maxLength(6)],
          asyncValidators: [UserValidators.checkExist(this.userService, 'referral_code')],
        },
      ],
      is_active: [false, [Validators.required]],
      role: this.fb.array([this.createRole()]),
    });
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

  createRole(): FormGroup {
    return this.fb.group({
      id_role: [null, Validators.required],
    });
  }

  addRole() {
    const roleForm = this.fb.group({
      id_role: [null, Validators.required],
    });
    this.role.push(roleForm);
  }

  deleteRole(roleIndex: any) {
    this.role.removeAt(roleIndex);
  }

  onSubmit(): void {
    const input = this.myForm.value;

    const bodyUser = input;

    this.userIsLoadingCreate$ = this.store.pipe(select(selectIsLoadingCreateUser));

    this.store.dispatch(
      fromUserActions.createUser({
        create: bodyUser,
      })
    );

    this.actions$
      .pipe(ofType(fromUserActions.createUserSuccess), takeUntil(this.unsubscribeUser$))
      .subscribe((result) => {
        Swal.fire({
          icon: 'success',
          text: `Pengguna ${result.data.profile.name} berhasil ditambahkan.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.router.navigate(['/general/user']);
        });
      });

    this.actions$
      .pipe(ofType(fromUserActions.createUserFailure), takeUntil(this.unsubscribeUser$))
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'User');
      });
  }
}
