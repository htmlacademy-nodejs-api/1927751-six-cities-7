import { IUser } from './user.interface.js';

export interface IComment {
  text: string;
  postDate: Date;
  rating: number;
  user: IUser;
}
