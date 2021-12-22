import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// PACKAGE
import { isEmpty } from 'lodash';

export function urlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (isEmpty(control.value)) {
      return null;
    }

    const urlRe = /^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/;
    const forbidden = urlRe.test(control.value);
    return forbidden ? null : { url: { value: control.value } };
  };
}
