import { PropertyType } from './property-type.enum.js';
import { User } from './user.type.js';
import { CityName } from './city-name.enum.js';
import { SupplyType } from './supply-type.enum.js';
import { Location } from './location.type.js';

export type Offer = {
  title: string;
  description: string;
  date: Date;
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
  host: User;
  commentsCount: number;
  location: Location;
}
