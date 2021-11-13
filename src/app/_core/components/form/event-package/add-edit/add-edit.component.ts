import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { AddEditStore } from '@components/form/event-package/add-edit/add-edit.store';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

// MODEL
import { EventData } from '@models';

// STORE
import { selectAllEvent } from '@store/event/event.selectors';
import { fromEventActions } from '@store/event/event.actions';

// PACKAGE
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'kb-form-event-package-add-edit',
  templateUrl: './add-edit.component.html',
  providers: [AddEditStore],
})
export class FormEventPackageAddEditComponent {
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
  eventData$!: Observable<EventData[]>;
  discountTypeData = [
    { value: 'fixed', label: 'Tetap' },
    { value: 'percentage', label: 'Persen' },
  ];

  readonly vm$ = this.addEditStore.vm$;

  constructor(
    private readonly addEditStore: AddEditStore,
    private actions$: Actions,
    private store: Store<any>
  ) {
    this.getAllEvent();
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
      }

      return { invalid: true, text };
    }

    return { invalid: false, text: null };
  }

  getAllEvent(): void {
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
      fromEventActions.loadAllEvent({
        params,
        pagination: false,
        infinite: false,
      })
    );

    this.eventData$ = this.store.pipe(
      select(selectAllEvent),
      filter((val) => val.length !== 0)
    );
  }

  onSwitch(control: AbstractControl | any, column: string): void {
    const controlNew = control.controls[column];
    const formGroup = control.controls;
    const name = Object.keys(formGroup).find((result) => controlNew === formGroup[result]) || null;

    let field: any[] = [];
    if (name === 'is_price') {
      field = ['price'];
    } else if (name === 'is_discount') {
      field = ['discount_type', 'discount'];
    }

    if (control?.value) {
      for (const row of field) {
        formGroup[row].setValue(null);
        formGroup[row].setValidators([Validators.required]);
      }
    } else {
      for (const row of field) {
        formGroup[row].setValue(null);
        formGroup[row].clearValidators();
      }
    }

    for (const row of field) {
      formGroup[row].updateValueAndValidity();
    }
  }
}
