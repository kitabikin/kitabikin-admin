import { Deserializable, Pagination } from '@models';

// PACKAGE
import { isArray } from 'lodash';

export class Application implements Deserializable {
  [x: string]: any;
  code!: number;
  error!: number;
  message!: string;
  pagination!: Pagination;
  data!: ApplicationData;

  deserialize(input: any): this {
    Object.assign(this, input);

    if (isArray(input.data)) {
      this.data = input.data.map((res: any) => new ApplicationData().deserialize(res));
    } else {
      this.data = new ApplicationData().deserialize(input.data);
    }

    return this;
  }
}

export class ApplicationData implements Deserializable {
  [x: string]: any;
  id_application?: string;
  code!: string;
  name!: string;
  image!: string;
  banner!: string;
  description!: string;
  is_active!: boolean;
  created_id!: string;
  created_at!: Date;
  modified_id!: string;
  modified_at!: Date;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
