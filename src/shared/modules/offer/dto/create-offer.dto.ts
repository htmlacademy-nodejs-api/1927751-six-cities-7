import {
  CityName,
  Location,
  PropertyType,
  SupplyType,
} from '../../../types/index.js';

export class CreateOfferDto {
  public title: string;
  public description: string;
  public postDate: Date;
  public city: CityName;
  public previewImage: string;
  public images: string[];
  public isPremium: boolean;
  public propertyType: PropertyType;
  public rooms: number;
  public guests: number;
  public price: number;
  public supplies: SupplyType[];
  public location: Location;
  public userId: string;
}
