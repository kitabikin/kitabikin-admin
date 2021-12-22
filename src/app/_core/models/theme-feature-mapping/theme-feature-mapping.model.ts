import { Deserializable, Pagination } from '@models';

// PACKAGE
import { isArray } from 'lodash';

export class ThemeFeatureMapping implements Deserializable {
  [x: string]: any;
  code!: number;
  error!: number;
  message!: string;
  pagination!: Pagination;
  data!: ThemeFeatureMappingData;

  deserialize(input: any): this {
    Object.assign(this, input);

    if (isArray(input.data)) {
      this.data = input.data.map((res: any) => new ThemeFeatureMappingData().deserialize(res));
    } else {
      this.data = new ThemeFeatureMappingData().deserialize(input.data);
    }

    return this;
  }
}

export class ThemeFeatureMappingData implements Deserializable {
  [x: string]: any;
  id_theme_feature_mapping!: string;
  id_theme_feature!: string;
  id_theme!: string;
  id_event_package!: string;
  is_active!: boolean;

  deserialize(input: any): this {
    Object.assign(this, input);

    return this;
  }
}
