import { DataBase } from './data-base';

export class GroupData extends DataBase<string> {
  override controlType = 'group';
}

export class TextData extends DataBase<string> {
  override controlType = 'text';
}

export class TextareaData extends DataBase<string> {
  override controlType = 'textarea';
}

export class DropdownData extends DataBase<string> {
  override controlType = 'dropdown';
}

export class FileData extends DataBase<string> {
  override controlType = 'file';
}

export class SwitchData extends DataBase<string> {
  override controlType = 'switch';
}

export class DatepickerData extends DataBase<string> {
  override controlType = 'datepicker';
}

export class DatetimepickerData extends DataBase<string> {
  override controlType = 'datetimepicker';
}
