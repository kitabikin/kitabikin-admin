import { Deserializable, Pagination, EventData, EventPriceData } from '@models';

// PACKAGE
import { isArray } from 'lodash';
import moment from 'moment';

export class EventPackage implements Deserializable {
  [x: string]: any;
  code!: number;
  error!: number;
  message!: string;
  pagination!: Pagination;
  data!: EventPackageData;

  deserialize(input: any): this {
    Object.assign(this, input);

    if (isArray(input.data)) {
      this.data = input.data.map((res: any) => new EventPackageData().deserialize(res));
    } else {
      this.data = new EventPackageData().deserialize(input.data);
    }

    return this;
  }
}

export class EventPackageData implements Deserializable {
  [x: string]: any;
  id_event!: string;
  id_event_package!: string;
  code!: string;
  name!: string;
  image!: string;
  banner!: string;
  description!: string;
  is_recomendation!: boolean;
  is_active!: boolean;
  is_delete!: boolean;
  created_id!: string;
  created_at!: Date;
  modified_id!: string;
  modified_at!: Date;
  event!: EventData;
  event_price!: EventPriceData;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }

  detailIsActive(): any {
    let name = '';
    let badge = '';

    if (this.is_active) {
      name = 'Aktif';
      badge = 'bg-green-100 text-green-900';
    } else {
      name = 'Arsip';
      badge = 'bg-gray-200 text-gray-600';
    }

    return {
      name,
      badge,
    };
  }

  getIsActive(): string {
    return this.detailIsActive().name;
  }

  getIsActiveBadge(): string {
    return this.detailIsActive().badge;
  }

  getCreatedAt(): string {
    return moment(this.created_at).locale('id').format('DD MMMM YYYY HH:mm');
  }

  getModifiedAt(): string {
    return moment(this.modified_at).locale('id').format('DD MMMM YYYY HH:mm');
  }
}
