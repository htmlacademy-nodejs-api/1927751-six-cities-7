import { UserType } from './user-type.enum.js';

export interface IUser {
  username: string;
  email: string;
  avatarPath: string;
  type: UserType;
}
