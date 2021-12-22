import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { AddEditStore } from '@components/form/role/add-edit/add-edit.store';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

// MODEL
import { ApplicationData } from '@models';

// STORE
import { selectAllApplication } from '@store/application/application.selectors';
import { fromApplicationActions } from '@store/application/application.actions';

// PACKAGE
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'kb-form-role-add-edit',
  templateUrl: './add-edit.component.html',
  providers: [AddEditStore],
})
export class FormRoleAddEditComponent {
  // Input
  @Input() set formGroup(value: FormGroup) {
    this.addEditStore.setFormGroup(value);
  }
  @Input() set isAddMode(value: boolean) {
    this.addEditStore.setIsAddMode(value);
  }

  // Data
  applicationData$!: Observable<ApplicationData[]>;

  readonly vm$ = this.addEditStore.vm$;

  constructor(
    private readonly addEditStore: AddEditStore,
    private actions$: Actions,
    private store: Store<any>
  ) {
    this.getAllApplication();
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
}
