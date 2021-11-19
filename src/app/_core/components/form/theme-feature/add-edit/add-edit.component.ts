import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { AddEditStore } from '@components/form/theme-feature/add-edit/add-edit.store';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil, filter, map } from 'rxjs/operators';

// MODEL
import { ThemeData } from '@models';

// STORE
import { selectTheme } from '@store/theme/theme.selectors';

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

  // Variable
  idTheme!: string;

  // Data
  themeData$!: Observable<ThemeData | undefined>;

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
      .subscribe((themeData: ThemeData | undefined) => {
        this.themeData$ = of(themeData);

        this.formGroup.patchValue({
          theme_code: themeData?.code,
        });
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
}
