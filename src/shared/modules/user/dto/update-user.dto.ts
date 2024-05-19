import { UserType } from '../../../types/index.js';

export class UpdateUserDto {
  public avatarPath?: string;
  public username?: string;
  public type?: UserType;
}
