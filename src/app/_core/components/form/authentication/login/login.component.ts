import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { LoginStore } from '@components/form/authentication/login/login.store';

import { faUser, faKey, faEyeSlash, faEye, faCircleNotch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'kb-form-authentication-login',
  templateUrl: './login.component.html',
  providers: [LoginStore],
})
export class FormAuthenticationLoginComponent {
  faUser = faUser;
  faKey = faKey;
  faEyeSlash = faEyeSlash;
  faEye = faEye;
  faCircleNotch = faCircleNotch;

  // Input
  @Input() set formGroup(value: any) {
    this.loginStore.setFormGroup(value);
  }
  @Input() set submitted(value: boolean) {
    this.loginStore.setSubmitted(value);
  }
  @Input() set isLoading(value: boolean) {
    this.loginStore.setIsLoading(value);
  }

  // Variable
  fieldTextType!: boolean;

  readonly vm$ = this.loginStore.vm$;

  constructor(private readonly loginStore: LoginStore) {}

  getFormValidation(control: AbstractControl | undefined, submitted: boolean): any {
    if (submitted) {
      let text: string | null = null;
      if (control?.errors?.['required']) {
        text = 'Harus diisi.';
      } else if (control?.errors?.['maxlength']) {
        text = 'Panjang maksimal 240 karakter.';
      }
      return { invalid: true, text };
    }

    return { invalid: false, text: null };
  }

  toggleFieldTextType(): void {
    this.fieldTextType = !this.fieldTextType;
  }
}
