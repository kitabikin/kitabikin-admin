import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { AddEditStore } from '@components/form/invitation/add-edit/add-edit.store';
import { filter } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

// MODEL
import { UserData, EventData, EventPackageData, ThemeCategoryData, ThemeData, User } from '@models';

// STORE
import { selectAllUser } from '@store/user/user.selectors';
import { fromUserActions } from '@store/user/user.actions';

import { selectAllEvent } from '@store/event/event.selectors';
import { fromEventActions } from '@store/event/event.actions';

import { selectAllEventPackage } from '@store/event-package/event-package.selectors';
import { fromEventPackageActions } from '@store/event-package/event-package.actions';

import { selectAllThemeCategory } from '@store/theme-category/theme-category.selectors';
import { fromThemeCategoryActions } from '@store/theme-category/theme-category.actions';

import { selectAllTheme } from '@store/theme/theme.selectors';
import { fromThemeActions } from '@store/theme/theme.actions';

// PACKAGE
import { isEmpty, map } from 'lodash';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'kb-form-invitation-add-edit',
  templateUrl: './add-edit.component.html',
  providers: [AddEditStore],
})
export class FormInvitationAddEditComponent implements OnInit {
  faCalendarAlt = faCalendarAlt;

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
  eventData$!: Observable<EventData[]>;
  eventPackageData$!: Observable<EventPackageData[]>;
  themeCategoryData$!: Observable<ThemeCategoryData[]>;
  themeData$!: Observable<ThemeData[]>;

  readonly vm$ = this.addEditStore.vm$;

  constructor(
    private readonly addEditStore: AddEditStore,
    private actions$: Actions,
    private store: Store<any>
  ) {}

  ngOnInit(): void {
    this.getAllUser();
    this.getAllEvent();

    if (!this.isAddMode) {
      this.getAllEventPackage(this.formGroup.controls['id_event'].value);
      this.getAllThemeCategory(this.formGroup.controls['id_event'].value);
      this.getAllTheme(this.formGroup.controls['id_theme_category'].value);
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

  getAllEventPackage(idEvent: string): void {
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
      fromEventPackageActions.loadAllEventPackage({
        params,
        pagination: false,
        infinite: false,
      })
    );

    this.eventPackageData$ = this.store.pipe(select(selectAllEventPackage));
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

  getAllTheme(idThemeCategory: string): void {
    const pSort = 'name:asc';

    const pWhere: any[] = [
      {
        is_delete: false,
      },
      {
        id_theme_category: idThemeCategory,
      },
    ];

    const params = {
      sort: pSort,
      where: pWhere,
    };

    this.store.dispatch(
      fromThemeActions.loadAllTheme({
        params,
        pagination: false,
        infinite: false,
      })
    );

    this.themeData$ = this.store.pipe(select(selectAllTheme));
  }

  onSelectedEvent(event: any): void {
    if (isEmpty(event)) {
      return;
    }

    this.onClearEvent();
    this.getAllEventPackage(event.id_event);
    this.getAllThemeCategory(event.id_event);
  }

  onClearEvent(): void {
    this.formGroup.controls['id_event_package'].reset();
    this.eventPackageData$ = of([]);

    this.formGroup.controls['id_theme_category'].reset();
    this.themeCategoryData$ = of([]);
  }

  onSelectedThemeCategory(event: any): void {
    if (isEmpty(event)) {
      return;
    }

    this.onClearThemeCategory();
    this.getAllTheme(event.id_theme_category);
  }

  onClearThemeCategory(): void {
    this.formGroup.controls['id_theme'].reset();
    this.themeData$ = of([]);
  }
}
