import { Deserializable, Pagination } from '@models';

// PACKAGE
import { isArray } from 'lodash';

export class ThemeFeatureColumn implements Deserializable {
  [x: string]: any;
  code!: number;
  error!: number;
  message!: string;
  pagination!: Pagination;
  data!: ThemeFeatureColumnData;

  deserialize(input: any): this {
    Object.assign(this, input);

    if (isArray(input.data)) {
      this.data = input.data.map((res: any) => new ThemeFeatureColumnData().deserialize(res));
    } else {
      this.data = new ThemeFeatureColumnData().deserialize(input.data);
    }

    return this;
  }
}

export class ThemeFeatureColumnData implements Deserializable {
  [x: string]: any;
  id_theme_feature_column!: string;
  id_theme_feature!: string;
  code!: string;
  label!: string;
  label_helper!: string;
  default_value!: string;
  configuration!: any;
  order!: number;
  description!: string;
  is_admin!: boolean;

  deserialize(input: any): this {
    Object.assign(this, input);

    return this;
  }

  detailIsActive(): any {
    let name = '';
    let badge = '';

    if (this.is_admin) {
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

  getIsActive(): string {
    return this.detailIsActive().name;
  }

  getIsActiveBadge(): string {
    return this.detailIsActive().badge;
  }
}
