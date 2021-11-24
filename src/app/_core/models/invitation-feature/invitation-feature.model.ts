import { Deserializable, Pagination, ThemeFeatureData, InvitationFeatureDataColumnData } from '@models';

// PACKAGE
import { isArray } from 'lodash';

export class InvitationFeature implements Deserializable {
  [x: string]: any;
  code!: number;
  error!: number;
  message!: string;
  pagination!: Pagination;
  data!: InvitationFeatureData;

  deserialize(input: any): this {
    Object.assign(this, input);

    if (isArray(input.data)) {
      this.data = input.data.map((res: any) => new InvitationFeatureData().deserialize(res));
    } else {
      this.data = new InvitationFeatureData().deserialize(input.data);
    }

    return this;
  }
}

export class InvitationFeatureData implements Deserializable {
  [x: string]: any;
  id_invitation_feature!: string;
  id_invitation!: string;
  id_theme_feature!: string;
  is_active!: boolean;
  theme_feature!: ThemeFeatureData;
  invitation_feature_data!: InvitationFeatureDataColumnData;

  deserialize(input: any): this {
    Object.assign(this, input);

    return this;
  }
}
