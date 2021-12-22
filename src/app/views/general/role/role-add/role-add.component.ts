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
import { takeUntil } from 'rxjs/operators';

// SERVICE
import { GlobalService } from '@services/private';
import { RoleService } from '@services';

// VALIDATOR
import { RoleValidators } from '@validators';

// STORE
import { selectIsLoadingCreate as selectIsLoadingCreateRole } from '@store/role/role.selectors';
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
  selector: 'kb-role-add',
  templateUrl: './role-add.component.html',
  styleUrls: ['./role-add.component.scss'],
})
export class RoleAddComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Pengaturan Umum', link: '/general' },
    { label: 'Peran', link: '/general/role' },
    { label: 'Tambah', link: '/general/role/add' },
  ];

  // Variable
  myForm!: FormGroup;

  // Data
  roleIsLoadingCreate$!: Observable<boolean>;

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
  }

  settingsAll(): void {
    const word = ['role', 'add'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans.add} ${trans.role}`;
      this.description = `${trans.add} ${trans.role}`;

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
      code: new FormControl(
        { value: null, disabled: false },
        {
          validators: [Validators.required, Validators.maxLength(240)],
          asyncValidators: RoleValidators.checkExist(this.roleService, 'code'),
        }
      ),
      name: new FormControl({ value: null, disabled: false }, [
        Validators.required,
        Validators.maxLength(240),
      ]),
      description: new FormControl({ value: null, disabled: false }),
      is_active: new FormControl({ value: false, disabled: false }, [Validators.required]),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeRole$.next();
    this.unsubscribeRole$.complete();
  }

  ngAfterViewInit(): void {}

  onSubmit(): void {
    const input = this.myForm.value;

    const bodyRole = input;

    this.roleIsLoadingCreate$ = this.store.pipe(select(selectIsLoadingCreateRole));

    this.store.dispatch(
      fromRoleActions.createRole({
        create: bodyRole,
      })
    );

    this.actions$
      .pipe(ofType(fromRoleActions.createRoleSuccess), takeUntil(this.unsubscribeRole$))
      .subscribe((result) => {
        Swal.fire({
          icon: 'success',
          text: `Peran ${result.data.name} berhasil ditambahkan.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.router.navigate(['/general/role']);
        });
      });

    this.actions$
      .pipe(ofType(fromRoleActions.createRoleFailure), takeUntil(this.unsubscribeRole$))
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'Role');
      });
  }
}
