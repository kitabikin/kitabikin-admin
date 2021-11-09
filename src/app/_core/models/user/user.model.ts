import { Deserializable, Pagination, ProfileData, RoleData } from '@models';

// PACKAGE
import { isArray } from 'lodash';
import moment from 'moment';

export class User implements Deserializable {
  [x: string]: any;
  code!: number;
  error!: number;
  message!: string;
  pagination!: Pagination;
  data!: UserData;

  deserialize(input: any): this {
    Object.assign(this, input);

    if (isArray(input.data)) {
      this.data = input.data.map((res: any) => new UserData().deserialize(res));
    } else {
      this.data = new UserData().deserialize(input.data);
    }

    return this;
  }
}

export class UserData implements Deserializable {
  [x: string]: any;
  id_user!: string;
  username!: string;
  email!: string;
  refferal_code!: string;
  signup_with!: string;
  is_email!: boolean;
  is_active!: boolean;
  is_delete!: boolean;
  created_id!: string;
  created_at!: Date;
  modified_id!: string;
  modified_at!: Date;
  profile!: ProfileData;
  role!: RoleData[];

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
