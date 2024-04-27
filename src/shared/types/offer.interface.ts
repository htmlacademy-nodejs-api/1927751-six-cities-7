import { PropertyType } from './property-type.enum.js';
import { IUser } from './user.interface.js';
import { CityName } from './city-name.enum.js';
import { SupplyType } from './supply-type.enum.js';
import { Location } from './location.type.js';

export interface IOffer {
  title: string;
  description: string;
  postDate: Date;
  city: CityName;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavourite: boolean;
  rating: number;
  propertyType: PropertyType;
  rooms: number;
  guests: number;
  price: number;
  supplies: SupplyType[];
  user: IUser;
  commentsCount: number;
  location: Location;
}
