import { UserType } from './user-type.enum.js';

export interface IUser {
  username: string;
  email: string;
  password: string;
  avatarPath?: string;
  type: UserType;
}
