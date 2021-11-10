import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { AddEditStore } from '@components/form/user/add-edit/add-edit.store';
import { filter, last } from 'rxjs/operators';
import { lastValueFrom, Observable, of } from 'rxjs';

// MODEL
import { ApplicationData, RoleData } from '@models';

// SERVICE
import { RoleService } from '@services';

// STORE
import { selectAllApplication } from '@store/application/application.selectors';
import { fromApplicationActions } from '@store/application/application.actions';

// PACKAGE
import { isEmpty, map } from 'lodash';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { faEyeSlash, faEye, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'kb-form-user-add-edit',
  templateUrl: './add-edit.component.html',
  providers: [AddEditStore],
})
export class FormUserAddEditComponent implements OnInit {
  faEyeSlash = faEyeSlash;
  faEye = faEye;
  faPlus = faPlus;
  faTrash = faTrash;

  // Input
  tempFormGroup!: FormGroup;
  @Input() set formGroup(value: FormGroup) {
    this.tempFormGroup = value;
    this.addEditStore.setFormGroup(value);
  }
  get formGroup(): FormGroup {
    return this.tempFormGroup;
  }

  tempIsAddMode!: boolean;
  @Input() set isAddMode(value: boolean) {
    this.tempIsAddMode = value;
    this.addEditStore.setIsAddMode(value);
  }
  get isAddMode(): boolean {
    return this.tempIsAddMode;
  }

  @Output() emitRoleAdd = new EventEmitter<any>();
  @Output() emitRoleDelete = new EventEmitter<any>();

  // Variable
  fieldTextType!: boolean;

  // Data
  applicationData$!: Observable<ApplicationData[]>;
  roleData: any[] = [];

  readonly vm$ = this.addEditStore.vm$;

  constructor(
    private readonly addEditStore: AddEditStore,
    private roleService: RoleService,
    private actions$: Actions,
    private store: Store<any>
  ) {}

  ngOnInit(): void {
    this.getAllApplication();

    // Is Edit Mode
    if (!this.isAddMode) {
      this.initEditMode();
    }
  }

  initEditMode(): void {
    const roles = this.formGroup.controls['role'].value;
    map(roles, (result, roleIndex: number) => {
      this.getAllRole(roleIndex, result.id_application);
    });
  }

  getFormValidation(control: AbstractControl | undefined | null): any {
    if (control?.invalid && (control?.dirty || control?.touched)) {
      let text: string | null = null;
      if (control?.errors?.['required']) {
        text = 'Harus diisi.';
      } else if (control?.errors?.['maxlength']) {
        if (control?.errors?.['maxlength'].requiredLength === 6) {
          text = 'Panjang maksimal 6 karakter.';
        } else if (control?.errors?.['maxlength'].requiredLength === 240) {
          text = 'Panjang maksimal 240 karakter.';
        }
      } else if (control?.errors?.['username_exist']) {
        text = 'Username sudah tersedia.';
      } else if (control?.errors?.['email']) {
        text = 'Email tidak valid.';
      } else if (control?.errors?.['email_exist']) {
        text = 'Email sudah tersedia.';
      } else if (control?.errors?.['referral_code_exist']) {
        text = 'Kode Referral sudah tersedia.';
      }

      return { invalid: true, text };
    }

    return { invalid: false, text: null };
  }

  getAllApplication(): void {
    const pSort = 'name:asc';

    const pWhere: any[] = [
      {
        is_delete: false,
      },
    ];

    const params = {
      sort: pSort,
      where: pWhere,
    };

    this.store.dispatch(
      fromApplicationActions.loadAllApplication({
        params,
        pagination: false,
        infinite: false,
      })
    );

    this.applicationData$ = this.store.pipe(
      select(selectAllApplication),
      filter((val) => val.length !== 0)
    );
  }

  getAllRole(roleIndex: number, idApplication: string): void {
    const pSort = 'name:asc';

    const pWhere: any[] = [
      {
        is_delete: false,
      },
      {
        id_application: idApplication,
      },
    ];

    const params = {
      sort: pSort,
      where: pWhere,
    };

    this.roleService.getList(params).subscribe((result) => {
      this.roleData[roleIndex] = result.data;
    });
  }

  forceUppercaseConditionally(control: AbstractControl | undefined): any {
    if (control?.value) {
      control.setValue(control.value.toUpperCase());
    }
  }

  toggleFieldTextType(): void {
    this.fieldTextType = !this.fieldTextType;
  }

  addRole(): void {
    this.emitRoleAdd.emit();
  }

  deleteRole(roleIndex: number): void {
    this.roleData.splice(roleIndex, 1);
    this.emitRoleDelete.emit(roleIndex);
  }

  onSelectedApplication(roleIndex: number, event: any, roleForm: AbstractControl): void {
    if (isEmpty(event)) {
      return;
    }

    this.onClearApplication(roleIndex, roleForm);
    this.getAllRole(roleIndex, event.id_application);
  }

  onClearApplication(roleIndex: number, roleForm: AbstractControl): void {
    roleForm.get('id_role')?.reset();
    this.roleData[roleIndex] = [];
  }
}
