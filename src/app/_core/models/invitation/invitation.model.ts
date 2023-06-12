import {
  Deserializable,
  Pagination,
  UserData,
  EventData,
  EventPackageData,
  ThemeCategoryData,
  ThemeData,
} from '@models';

// PACKAGE
import { isArray } from 'lodash';
import moment from 'moment';

export class Invitation implements Deserializable {
  [x: string]: any;
  code!: number;
  error!: number;
  message!: string;
  pagination!: Pagination;
  data!: InvitationData;

  deserialize(input: any): this {
    Object.assign(this, input);

    if (isArray(input.data)) {
      this.data = input.data.map((res: any) => new InvitationData().deserialize(res));
    } else {
      this.data = new InvitationData().deserialize(input.data);
    }

    return this;
  }
}

export class InvitationData implements Deserializable {
  [x: string]: any;
  id_invitation!: string;
  id_user!: string;
  id_event!: string;
  id_event_package!: string;
  id_theme_category!: string;
  id_theme!: string;
  code!: string;
  name!: string;
  invitation_at!: Date;
  description!: string;
  metadata!: string;
  is_active!: boolean;
  is_delete!: boolean;
  created_id!: string;
  created_at!: Date;
  modified_id!: string;
  modified_at!: Date;
  user!: UserData;
  event!: EventData;
  event_package!: EventPackageData;
  theme_category!: ThemeCategoryData;
  theme!: ThemeData;

  deserialize(input: any): this {
    Object.assign(this, input);

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

  getInvitationAt(): string {
    return moment(this.invitation_at).locale('id').format('DD MMMM YYYY');
  }

  getCreatedAt(): string {
    return moment(this.created_at).locale('id').format('DD MMMM YYYY HH:mm');
  }

  getModifiedAt(): string {
    return moment(this.modified_at).locale('id').format('DD MMMM YYYY HH:mm');
  }
}
