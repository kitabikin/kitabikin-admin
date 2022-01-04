import { Deserializable, Pagination } from '@models';

// PACKAGE
import { isArray } from 'lodash';
import moment from 'moment';

export class InvitationGuestBook implements Deserializable {
  [x: string]: any;
  code!: number;
  error!: number;
  message!: string;
  pagination!: Pagination;
  data!: InvitationGuestBookData;

  deserialize(input: any): this {
    Object.assign(this, input);

    if (isArray(input.data)) {
      this.data = input.data.map((res: any) => new InvitationGuestBookData().deserialize(res));
    } else {
      this.data = new InvitationGuestBookData().deserialize(input.data);
    }

    return this;
  }
}

export class InvitationGuestBookData implements Deserializable {
  [x: string]: any;
  id_invitation_guest_book!: string;
  id_invitation!: string;
  name!: string;
  address!: string;
  no_telp!: string;
  type!: string;
  from!: string;
  qr_code!: string;
  qr_code_url!: string;
  confirmation!: string;
  total_reservation!: number;
  session!: number;
  is_send!: boolean;
  is_checkin!: boolean;
  is_active!: boolean;
  is_delete!: boolean;
  created_id!: string;
  created_at!: Date;
  modified_id!: string;
  modified_at!: Date;
  checkin_at!: Date;
  parent!: any;

  deserialize(input: any): this {
    Object.assign(this, input);

    return this;
  }

  detailConfirmation(): any {
    let name = '';
    let badge = '';

    if (this.confirmation === 'yes') {
      name = 'Hadir';
      badge = 'bg-green-100 text-green-900';
    } else if (this.confirmation === 'no') {
      name = 'Tidak Hadir';
      badge = 'bg-red-100 text-red-900';
    } else {
      name = 'Belum';
      badge = 'bg-gray-200 text-gray-600';
    }

    return {
      name,
      badge,
    };
  }

  getConfirmation(): string {
    return this.detailConfirmation().name;
  }

  getConfirmationBadge(): string {
    return this.detailConfirmation().badge;
  }

  detailType(): any {
    let name = '';

    switch (this.type) {
      case 'vip':
        name = 'VIP';
        break;
      case 'keluarga':
        name = 'Keluarga';
        break;
      default:
        name = 'Biasa';
        break;
    }

    return {
      name,
    };
  }

  getType(): string {
    return this.detailType().name;
  }

  detailIsSend(): any {
    let name = '';
    let badge = '';

    if (this.is_send) {
      name = 'Sudah';
      badge = 'bg-green-100 text-green-900';
    } else {
      name = 'Belum';
      badge = 'bg-gray-200 text-gray-600';
    }

    return {
      name,
      badge,
    };
  }

  getIsSend(): string {
    return this.detailIsSend().name;
  }

  getIsSendBadge(): string {
    return this.detailIsSend().badge;
  }

  detailIsCheckin(): any {
    let name = '';
    let badge = '';

    if (this.is_checkin) {
      name = 'Hadir';
      badge = 'bg-green-100 text-green-900';
    } else {
      name = 'Tidak Hadir';
      badge = 'bg-red-100 text-red-900';
    }

    return {
      name,
      badge,
    };
  }

  getIsCheckin(): string {
    return this.detailIsCheckin().name;
  }

  getIsCheckinBadge(): string {
    return this.detailIsCheckin().badge;
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

  getCheckInAt(): string {
    return moment(this.checkin_at).locale('id').format('DD MMMM YYYY HH:mm');
  }
}
