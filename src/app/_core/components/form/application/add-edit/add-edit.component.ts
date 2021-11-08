import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { AddEditStore } from '@components/form/application/add-edit/add-edit.store';

@Component({
  selector: 'kb-form-application-add-edit',
  templateUrl: './add-edit.component.html',
  providers: [AddEditStore],
})
export class FormApplicationAddEditComponent {
  // Input
  @Input() set formGroup(value: FormGroup) {
    this.addEditStore.setFormGroup(value);
  }
  @Input() set isAddMode(value: boolean) {
    this.addEditStore.setIsAddMode(value);
  }

  readonly vm$ = this.addEditStore.vm$;

  constructor(private readonly addEditStore: AddEditStore) {}

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
}
