import { Component, Input, Self, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { ControlValueAccessor, NgControl } from '@angular/forms';

import { FileUploaderStore } from '@components/_components/file-uploader/file-uploader.store';

// SERVICE
import { FunctionService, UploadService } from '@services';

// PACKAGE
import { includes } from 'lodash';

@Component({
  selector: 'kb-file-uploader',
  templateUrl: './file-uploader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FileUploaderStore],
})
export class FileUploaderComponent implements ControlValueAccessor {
  // Input
  @Input() set label(value: string) {
    this.fileUploaderStore.setLabel(value);
  }
  @Input() set description(value: string) {
    this.fileUploaderStore.setDescription(value);
  }
  @Input() set isImage(value: boolean) {
    this.fileUploaderStore.setIsImage(value);
  }

  iAccept!: any[];
  @Input() set accept(value: any[]) {
    this.iAccept = value;
    this.fileUploaderStore.setAccept(value);
  }
  get accept(): any[] {
    return this.iAccept;
  }

  @Input() set multiple(value: boolean) {
    this.fileUploaderStore.setMultiple(value);
  }
  @Input() set size(value: string) {
    this.fileUploaderStore.setSize(value);
  }
  @Input() set required(value: boolean) {
    this.fileUploaderStore.setRequired(value);
  }
  @Input() set disabled(value: boolean) {
    this.fileUploaderStore.setDisabled(value);
  }

  iFolder!: string;
  @Input() set folder(value: string) {
    this.iFolder = value;
    this.fileUploaderStore.setFolder(value);
  }
  get folder(): string {
    return this.iFolder;
  }

  // Variable
  val: any = '';

  // Data
  isLoading = false;
  progress!: number;

  readonly vm$ = this.fileUploaderStore.vm$;

  constructor(
    @Self() public controlDir: NgControl,
    private cdRef: ChangeDetectorRef,
    private readonly fileUploaderStore: FileUploaderStore,
    private functionService: FunctionService,
    private uploadService: UploadService
  ) {
    this.controlDir.valueAccessor = this;
  }

  onChange: any = () => {};
  onTouch: any = () => {};

  get value(): string {
    return this.val;
  }

  @Input() set value(val) {
    this.fileUploaderStore.setValue(val);
    if (val !== undefined && this.val !== val) {
      this.val = val;
      this.onChange(val);
      this.onTouch(val);
    }
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  getFormValidation(): any {
    const f = this.controlDir.control;
    if (f?.invalid && (f?.dirty || f?.touched)) {
      let text: string | null = null;
      if (f?.errors?.['required']) {
        text = 'Harus diisi.';
      } else if (f?.errors?.['wrongType']) {
        text = 'Format tidak sesuai.';
      }

      return { invalid: true, text };
    }

    return { invalid: false, text: null };
  }

  getClassname(size = 'normal'): string {
    let sizeClassname = '';
    switch (size) {
      case 'small':
        sizeClassname = 'form-control-sm';
        break;
      case 'large':
        sizeClassname = 'form-control-lg';
        break;
      default:
        sizeClassname = '';
        break;
    }

    return sizeClassname;
  }

  getImageURL(value: string): string {
    return this.functionService.imageURL(value);
  }

  onUpload(event: any): void {
    const fileList: FileList = event.target.files;

    if (fileList.length === 0) {
      return;
    }

    const file: File = fileList[0];

    if (!includes(this.iAccept, `.${file.name.split('.').pop()?.toLowerCase()}`)) {
      this.controlDir.control?.setValue(null);
      this.controlDir.control?.setErrors({ wrongType: true });
      this.controlDir.control?.markAsTouched();
      return;
    } else {
      this.controlDir.control?.setErrors(null);
      this.controlDir.control?.markAsTouched();
    }

    const formData: FormData = new FormData();
    formData.append('image', file, file.name);
    formData.append('folder', this.folder);

    this.uploadService.createSingle(formData).subscribe((result) => {
      if (result['type'] === HttpEventType.UploadProgress) {
        this.isLoading = true;
        this.progress = Math.round((100 * result['loaded']) / result['total']);
      } else if (result['type'] === HttpEventType.Response) {
        this.isLoading = false;
        this.value = result['body'].data.secure_url;
        this.cdRef.markForCheck();
      }
    });
  }
}
