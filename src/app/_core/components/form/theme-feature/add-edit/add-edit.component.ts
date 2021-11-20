import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { AddEditStore } from '@components/form/theme-feature/add-edit/add-edit.store';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil, filter, map } from 'rxjs/operators';

// MODEL
import { ThemeData, EventPackageData, EventPriceData } from '@models';

// STORE
import { selectTheme } from '@store/theme/theme.selectors';

import { selectAllEventPackage } from '@store/event-package/event-package.selectors';
import { fromEventPackageActions } from '@store/event-package/event-package.actions';

// PACKAGE
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'kb-form-theme-feature-add-edit',
  templateUrl: './add-edit.component.html',
  providers: [AddEditStore],
})
export class FormThemeFeatureAddEditComponent implements OnInit {
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

  @Output() emitThemeFeatureAdd = new EventEmitter<any>();
  @Output() emitThemeFeatureDelete = new EventEmitter<any>();
  @Output() emitThemeFeatureMappingAdd = new EventEmitter<any>();

  // Variable
  idTheme!: string;

  // Data
  themeData$!: Observable<ThemeData | undefined>;
  eventPackageData!: EventPackageData[];

  readonly vm$ = this.addEditStore.vm$;

  private unsubscribeTheme$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private readonly addEditStore: AddEditStore,
    private actions$: Actions,
    private store: Store<any>
  ) {
    this.idTheme = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getTheme();
  }

  getTheme(): void {
    this.store
      .pipe(select(selectTheme(this.idTheme)), takeUntil(this.unsubscribeTheme$))
      .subscribe((result: ThemeData | undefined) => {
        this.themeData$ = of(result);

        this.formGroup.patchValue({
          theme_code: result?.code,
        });

        this.getAllEventPackage(result?.theme_category.event.id_event);
      });
  }

  getAllEventPackage(idEvent: string | undefined): void {
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

    this.store
      .pipe(
        select(selectAllEventPackage),
        filter((val) => val.length !== 0)
      )
      .subscribe((result: EventPackageData[]) => {
        this.eventPackageData = result;

        this.addThemeFeatureMapping(result);
      });
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

  addThemeFeature(): void {
    this.emitThemeFeatureAdd.emit();
  }

  deleteThemeFeature(themeFeatureIndex: number): void {
    this.emitThemeFeatureDelete.emit(themeFeatureIndex);
  }

  addThemeFeatureMapping(eventPackageData: EventPackageData[]): void {
    this.emitThemeFeatureMappingAdd.emit(eventPackageData);
  }
}
