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
  is_discount!: boolean;
  is_price!: boolean;
  created_id!: string;
  created_at!: Date;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }

  detailIsDiscount(): any {
    let name = '';
    let badge = '';

    if (this.is_discount) {
      name = 'Ya';
      badge = 'bg-green-100 text-green-900';
    } else {
      name = 'Tidak';
      badge = 'bg-red-100 text-red-900';
    }

    return {
      name,
      badge,
    };
  }

  getIsDiscount(): string {
    return this.detailIsDiscount().name;
  }

  getIsDiscountBadge(): string {
    return this.detailIsDiscount().badge;
  }

  getIsDiscountType(): string {
    let name = '';

    switch (this.discount_type) {
      case 'fixed':
        name = 'Tetap';
        break;
      case 'percentage':
        name = 'Persen';
        break;
      default:
        name = '';
        break;
    }

    return name;
  }

  detailIsPrice(): any {
    let name = '';
    let badge = '';

    if (this.is_price) {
      name = 'Ya';
      badge = 'bg-green-100 text-green-900';
    } else {
      name = 'Tidak';
      badge = 'bg-red-100 text-red-900';
    }

    return {
      name,
      badge,
    };
  }

  getIsPrice(): string {
    return this.detailIsPrice().name;
  }

  getIsPriceBadge(): string {
    return this.detailIsPrice().badge;
  }

  getIsPriceDiscount(): number {
    let price = 0;

    switch (this.discount_type) {
      case 'fixed':
        price = this.price - this.discount;
        break;
      case 'percentage':
        price = this.price - (this.price * this.discount) / 100;
        break;
      default:
        price = this.price;
        break;
    }

    return price;
  }

  getCreatedAt(): string {
    return moment(this.created_at).locale('id').format('DD MMMM YYYY HH:mm');
  }
}
