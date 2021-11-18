import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { AddEditStore } from '@components/form/theme/add-edit/add-edit.store';
import { filter } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

// MODEL
import { EventData, ThemeCategoryData } from '@models';

// STORE
import { selectAllEvent } from '@store/event/event.selectors';
import { fromEventActions } from '@store/event/event.actions';

import { selectAllThemeCategory } from '@store/theme-category/theme-category.selectors';
import { fromThemeCategoryActions } from '@store/theme-category/theme-category.actions';

// PACKAGE
import { isEmpty, map } from 'lodash';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'kb-form-theme-add-edit',
  templateUrl: './add-edit.component.html',
  providers: [AddEditStore],
})
export class FormThemeAddEditComponent implements OnInit {
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
  themeCategoryData$!: Observable<ThemeCategoryData[]>;

  readonly vm$ = this.addEditStore.vm$;

  constructor(
    private readonly addEditStore: AddEditStore,
    private actions$: Actions,
    private store: Store<any>
  ) {}

  ngOnInit(): void {
    this.getAllEvent();

    if (!this.isAddMode) {
      this.getAllThemeCategory(this.formGroup.controls['id_event'].value);
    }
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
      } else if (control?.errors?.['wrongType']) {
        text = 'Format tidak sesuai.';
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

  getAllThemeCategory(idEvent: string): void {
    const pSort = 'name:asc';

    const pWhere: any[] = [
      {
        is_delete: false,
      },
      {
        id_event: idEvent,
      },
    ];

    const params = {
      sort: pSort,
      where: pWhere,
    };

    this.store.dispatch(
      fromThemeCategoryActions.loadAllThemeCategory({
        params,
        pagination: false,
        infinite: false,
      })
    );

    this.themeCategoryData$ = this.store.pipe(select(selectAllThemeCategory));
  }

  onSelectedEvent(event: any): void {
    if (isEmpty(event)) {
      return;
    }

    this.onClearEvent();
    this.getAllThemeCategory(event.id_event);
  }

  onClearEvent(): void {
    this.formGroup.controls['id_theme_category'].reset();
    this.themeCategoryData$ = of([]);
  }
}
