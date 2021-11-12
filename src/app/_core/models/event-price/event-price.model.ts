import { Deserializable, Pagination } from '@models';

// PACKAGE
import { isArray } from 'lodash';
import moment from 'moment';

export class EventPrice implements Deserializable {
  [x: string]: any;
  code!: number;
  error!: number;
  message!: string;
  pagination!: Pagination;
  data!: EventPriceData;

  deserialize(input: any): this {
    Object.assign(this, input);

    if (isArray(input.data)) {
      this.data = input.data.map((res: any) => new EventPriceData().deserialize(res));
    } else {
      this.data = new EventPriceData().deserialize(input.data);
    }

    return this;
  }
}

export class EventPriceData implements Deserializable {
  [x: string]: any;
  id_event_price!: string;
  id_event_package!: string;
  discount_type!: string;
  discount!: number;
  price!: number;
  description!: string;
  created_id!: string;
  created_at!: Date;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }

  getCreatedAt(): string {
    return moment(this.created_at).locale('id').format('DD MMMM YYYY HH:mm');
  }
}
