import { Deserializable, Pagination } from '@models';

// PACKAGE
import { isArray } from 'lodash';

export class Upload implements Deserializable {
  [x: string]: any;
  code!: number;
  error!: number;
  message!: string;
  pagination!: Pagination;
  data!: UploadData;

  deserialize(input: any): this {
    Object.assign(this, input);

    if (isArray(input.data)) {
      this.data = input.data.map((res: any) => new UploadData().deserialize(res));
    } else {
      this.data = new UploadData().deserialize(input.data);
    }

    return this;
  }
}

export class UploadData implements Deserializable {
  [x: string]: any;
  public_id!: string;
  secure_url!: string;

  deserialize(input: any): this {
    Object.assign(this, input);

    return this;
  }
}
