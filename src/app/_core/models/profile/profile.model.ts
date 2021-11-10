import { Deserializable, Pagination } from '@models';

// PACKAGE
import { isArray } from 'lodash';

export class Profile implements Deserializable {
  [x: string]: any;
  code!: number;
  error!: number;
  message!: string;
  pagination!: Pagination;
  data!: ProfileData;

  deserialize(input: any): this {
    Object.assign(this, input);

    if (isArray(input.data)) {
      this.data = input.data.map((res: any) => new ProfileData().deserialize(res));
    } else {
      this.data = new ProfileData().deserialize(input.data);
    }

    return this;
  }
}

export class ProfileData implements Deserializable {
  [x: string]: any;
  id_profile!: string;
  id_user!: string;
  name!: string;
  photo!: string;
  banner!: string;
  bio!: string;
  created_id!: string;
  created_at!: Date;
  modified_id!: string;
  modified_at!: Date;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
