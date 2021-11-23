import { Deserializable, Pagination } from '@models';

// PACKAGE
import { isArray } from 'lodash';

export class InvitationFeatureDataColumn implements Deserializable {
  [x: string]: any;
  code!: number;
  error!: number;
  message!: string;
  pagination!: Pagination;
  data!: InvitationFeatureDataColumnData;

  deserialize(input: any): this {
    Object.assign(this, input);

    if (isArray(input.data)) {
      this.data = input.data.map((res: any) => new InvitationFeatureDataColumnData().deserialize(res));
    } else {
      this.data = new InvitationFeatureDataColumnData().deserialize(input.data);
    }

    return this;
  }
}

export class InvitationFeatureDataColumnData implements Deserializable {
  [x: string]: any;
  id_invitation_feature_data!: string;
  id_invitation_feature!: string;
  id_theme_feature_column!: string;
  is_active!: boolean;
  value!: any;

  deserialize(input: any): this {
    Object.assign(this, input);

    return this;
  }
}
