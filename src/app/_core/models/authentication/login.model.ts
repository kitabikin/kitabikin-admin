import { Deserializable } from '@models';

export class Login implements Deserializable {
  [x: string]: any;
  message!: string;
  data!: LoginData;
  error!: number;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}

export class LoginData implements Deserializable {
  [x: string]: any;
  id_user!: string;
  username!: string;
  profile!: any;
  role!: any;
  token!: string;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
