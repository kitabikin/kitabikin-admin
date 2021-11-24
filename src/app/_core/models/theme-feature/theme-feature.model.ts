import { Deserializable, Pagination, ThemeFeatureColumnData, ThemeFeatureMappingData } from '@models';

// PACKAGE
import { isArray } from 'lodash';
import moment from 'moment';

export class ThemeFeature implements Deserializable {
  [x: string]: any;
  code!: number;
  error!: number;
  message!: string;
  pagination!: Pagination;
  data!: ThemeFeatureData;

  deserialize(input: any): this {
    Object.assign(this, input);

    if (isArray(input.data)) {
      this.data = input.data.map((res: any) => new ThemeFeatureData().deserialize(res));
    } else {
      this.data = new ThemeFeatureData().deserialize(input.data);
    }

    return this;
  }
}

export class ThemeFeatureData implements Deserializable {
  [x: string]: any;
  id_theme_feature!: string;
  id_theme!: string;
  code!: string;
  name!: string;
  order!: number;
  description!: string;
  is_active!: boolean;
  is_delete!: boolean;
  is_admin!: boolean;
  is_new!: boolean;
  created_id!: string;
  created_at!: Date;
  modified_id!: string;
  modified_at!: Date;
  theme_feature_column!: ThemeFeatureColumnData[];
  theme_feature_mapping!: ThemeFeatureMappingData[];

  deserialize(input: any): this {
    Object.assign(this, input);

    if (isArray(input.theme_feature_column)) {
      this.theme_feature_column = input.theme_feature_column.map((res: any) =>
        new ThemeFeatureColumnData().deserialize(res)
      );
    }

    return this;
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
