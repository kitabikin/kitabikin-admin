import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, first, map, switchMap, take, tap } from 'rxjs/operators';

// SERVICE
import { ThemeFeatureService } from '@services';

export class ThemeFeatureValidators {
  static checkExist(
    themeFeatureService: ThemeFeatureService,
    field: string,
    initialValue: string | null = null
  ): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      if (!control.valueChanges || control.pristine) {
        return of(null);
      }

      const isAddMode = initialValue ? false : true;

      return control.valueChanges
        .pipe(
          debounceTime(1000),
          distinctUntilChanged(),
          take(1),
          switchMap((value) => {
            const pWhere: any[] = [
              {
                is_delete: false,
              },
              {
                [field]: value,
              },
            ];

            const params = {
              where: pWhere,
            };

            return themeFeatureService.getTotal(params);
          }),
          tap(() => control.markAsTouched()),
          map((result) => {
            if (result.data['count'] > 0) {
              if (!isAddMode && initialValue === control.value) {
                return null;
              }
              return { [`${field}_exist`]: true };
            } else {
              return null;
            }
          })
        )
        .pipe(first());
    };
  }
}
