import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { AddEditStore } from '@components/form/testimonial/add-edit/add-edit.store';
import { filter } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

// MODEL
import { UserData } from '@models';

// STORE
import { selectAllUser } from '@store/user/user.selectors';
import { fromUserActions } from '@store/user/user.actions';

// PACKAGE
import { isEmpty, map } from 'lodash';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'kb-form-testimonial-add-edit',
  templateUrl: './add-edit.component.html',
  providers: [AddEditStore],
})
export class FormTestimonialAddEditComponent {
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

  // Data
  userData$!: Observable<UserData[]>;

  readonly vm$ = this.addEditStore.vm$;

  constructor(
    private readonly addEditStore: AddEditStore,
    private actions$: Actions,
    private store: Store<any>
  ) {}

  ngOnInit(): void {
    this.getAllUser();
  }

  getFormValidation(control: AbstractControl | undefined): any {
    if (control?.invalid && (control?.dirty || control?.touched)) {
      let text: string | null = null;
      if (control?.errors?.['required']) {
        text = 'Harus diisi.';
      } else if (control?.errors?.['maxlength']) {
        text = 'Panjang maksimal 240 karakter.';
      } else if (control?.errors?.['code_exist']) {
        text = 'Kode sudah tersedia.';
      } else if (control?.errors?.['min']) {
        text = 'Kurang dari 1.';
      } else if (control?.errors?.['max']) {
        text = 'Lebih dari 5.';
      }

      return { invalid: true, text };
    }

    return { invalid: false, text: null };
  }

  getAllUser(): void {
    const pSort = 'profile:asc';

    const pWhere: any[] = [
      {
        is_delete: false,
      },
      {
        // Application Invitation
        ['role:id_application']: '8f725fb8-2c8a-4de9-89ea-c6e5f1173fbb',
      },
      {
        // Role Client
        ['role:id_role']: '30cb66e6-7c61-4115-8099-f0493b6ee925',
      },
    ];

    const params = {
      sort: pSort,
      where: pWhere,
      with: [{ profile: true }, { role: true }],
    };

    this.store.dispatch(
      fromUserActions.loadAllUser({
        params,
        pagination: false,
        infinite: false,
      })
    );

    this.userData$ = this.store.pipe(
      select(selectAllUser),
      filter((val) => val.length !== 0)
    );
  }

  onSelectedUser(event: any): void {
    this.formGroup.controls['name'].setValue(event.profile.name);
  }

  onClearUser(): void {
    this.formGroup.controls['name'].reset();
  }
}
