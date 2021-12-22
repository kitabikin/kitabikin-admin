export class DataBase<T> {
  value: T | undefined;
  id: string;
  key: string;
  label: string;
  required: boolean;
  order: number;
  formType: string;
  controlType: string;
  type: string;
  options: { key: string; value: string }[];
  sub: any[];

  constructor(
    options: {
      value?: T;
      key?: string;
      id?: string;
      label?: string;
      required?: boolean;
      order?: number;
      formType?: string;
      controlType?: string;
      type?: string;
      options?: { key: string; value: string }[];
      sub?: any[];
    } = {}
  ) {
    this.value = options.value;
    this.id = options.id || '';
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.formType = options.formType || '';
    this.controlType = options.controlType || '';
    this.type = options.type || '';
    this.options = options.options || [];
    this.sub = options.sub || [];
  }
}
