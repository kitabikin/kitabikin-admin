import { Component, Input, forwardRef, ElementRef } from '@angular/core';
import { NgControl, FormGroupDirective, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'kb-datetime-picker',
  template: `
    <div ngbDropdown (openChange)="!$event && onTouch()">
      <div kbInput class="input-group input-search right">
        <input
          [ngClass]="[parentClass, 'form-control']"
          [ngModel]="_value ? (_value | date: mask:'+0000') : label"
          ngbDropdownToggle
          readonly
          [style.cursor]="'pointer'"
        />
        <span class="input-group-text">
          <fa-icon class="me-2" [icon]="faCalendarAlt"></fa-icon>
        </span>
      </div>
      <div ngbDropdownMenu class="p-0">
        <ngb-datepicker class="mb-3" #dp [(ngModel)]="date" (dateSelect)="getDatetime()"></ngb-datepicker>
        <ngb-timepicker
          class="mt-3"
          [hourStep]="hourStep"
          [minuteStep]="minuteStep"
          [meridian]="meridian"
          [spinners]="spinners"
          [ngModel]="time"
          (ngModelChange)="time = $event; getDatetime()"
        ></ngb-timepicker>
      </div>
    </div>
  `,
  styles: [
    `
      .datepicker {
        color: black;
        border: 1px solid silver;
      }
      .btn-link:disabled {
        color: gray !important;
      }
      ::ng-deep ngb-datepicker {
        border: 1px solid transparent !important;
      }
      ::ng-deep ngb-timepicker {
        fieldset {
          padding-bottom: 16px;
        }
        .ngb-tp {
          justify-content: center;
        }
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerComponent),
      multi: true,
    },
  ],
})
export class DateTimePickerComponent implements ControlValueAccessor {
  faCalendarAlt = faCalendarAlt;

  @Input() mask = 'medium';
  @Input() meridian: boolean = false;
  @Input() placeholder: string = 'yyyy/MM/dd hh:mm';
  @Input() hourStep = 1;
  @Input() minuteStep = 1;
  @Input() spinners: boolean = true;

  date: any;
  time: any = { hour: 0, minute: 0 };
  isDisabled!: boolean;
  onChange = (_: any) => {};
  onTouch = () => {};
  _value: any;
  label: any;
  control: any;
  get parentClass() {
    return this.elementRef.nativeElement.className;
  }
  constructor(private elementRef: ElementRef) {}
  getDatetime() {
    let value = null;
    if (!this.date) {
      value = this.placeholder;
      this._value = null;
    } else {
      value = new Date(
        Date.UTC(
          this.date.year,
          this.date.month - 1,
          this.date.day,
          this.time ? this.time.hour : 0,
          this.time ? this.time.minute : 0
        )
      );
      this._value = value;
    }

    this.onChange(this._value);
    this.label = value;
  }

  writeValue(obj: any): void {
    if (obj && obj.getFullYear()) {
      const date = new Date(
        obj.getFullYear(),
        obj.getMonth() + 1,
        obj.getDate(),
        obj.getHours(),
        obj.getMinutes()
      );

      this.date = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      };
      this.time = {
        hour: this.hourStep * Math.round(date.getHours() / this.hourStep),
        minute: this.minuteStep * Math.round(date.getMinutes() / this.minuteStep),
      };
      setTimeout(() => {
        this.getDatetime();
      });
    }
    this.getDatetime();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }
}
