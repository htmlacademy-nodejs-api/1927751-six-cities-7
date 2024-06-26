import {
  defaultClasses,
  getModelForClass,
  prop,
  modelOptions,
} from '@typegoose/typegoose';

import { IUser, UserType } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  },
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements IUser {
  @prop({ unique: true, required: true })
  public email: string;

  @prop({ unique: true, required: true })
  public username: string;

  @prop({ required: false, default: ' ' })
  public avatarPath: string;

  @prop({
    required: true,
    type: () => String,
    enum: UserType,
    default: UserType.User,
  })
  public type: UserType;

  @prop({ required: true, default: ' ' })
  private password?: string;

  constructor(userData: IUser) {
    super();

    this.email = userData.email;
    this.avatarPath = userData.avatarPath;
    this.username = userData.username;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }

  @prop({ required: true, default: [] })
  public favourites: string[];
}

export const UserModel = getModelForClass(UserEntity);
