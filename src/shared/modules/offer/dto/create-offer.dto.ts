import {
  MinLength,
  MaxLength,
  IsDateString,
  IsEnum,
  IsArray,
  IsBoolean,
  IsInt,
  IsMongoId,
  IsObject,
  IsNumber,
} from 'class-validator';

import {
  CityName,
  Location,
  PropertyType,
  SupplyType,
} from '../../../types/index.js';
import { CreateOfferValidationMessage } from './create-offer.messages.js';

export class CreateOfferDto {
  @MinLength(10, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateOfferValidationMessage.title.maxLength })
  public title: string;

  @MinLength(20, {
    message: CreateOfferValidationMessage.description.minLength,
  })
  @MaxLength(1024, {
    message: CreateOfferValidationMessage.description.maxLength,
  })
  public description: string;

  @IsDateString(
    {},
    { message: CreateOfferValidationMessage.postDate.invalidFormat }
  )
  public postDate: Date;

  @IsEnum(CityName, { message: CreateOfferValidationMessage.city.invalid })
  public city: CityName;

  @MinLength(256, {
    message: CreateOfferValidationMessage.previewImage.minLength,
  })
  public previewImage: string;

  @IsArray({ message: CreateOfferValidationMessage.images.invalidFormat })
  @MinLength(256, {
    each: true,
    message: CreateOfferValidationMessage.images.minLength,
  })
  public images: string[];

  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalid })
  public isPremium: boolean;

  @IsEnum(PropertyType, {
    message: CreateOfferValidationMessage.propertyType.invalid,
  })
  public propertyType: PropertyType;

  @IsInt({ message: CreateOfferValidationMessage.rooms.invalidFormat })
  @MinLength(1, { message: CreateOfferValidationMessage.rooms.minValue })
  @MaxLength(8, { message: CreateOfferValidationMessage.rooms.maxValue })
  public rooms: number;

  @IsInt({ message: CreateOfferValidationMessage.guests.invalidFormat })
  @MinLength(1, { message: CreateOfferValidationMessage.guests.minValue })
  @MaxLength(10, { message: CreateOfferValidationMessage.guests.maxValue })
  public guests: number;

  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  @MinLength(100, { message: CreateOfferValidationMessage.price.minValue })
  @MaxLength(100000, { message: CreateOfferValidationMessage.price.maxValue })
  public price: number;

  @IsArray({ message: CreateOfferValidationMessage.supplies.invalidFormat })
  @IsEnum(SupplyType, {
    each: true,
    message: CreateOfferValidationMessage.supplies.invalidFormat,
  })
  public supplies: SupplyType[];

  //TODO: how validate coordinates???
  @IsObject({ message: CreateOfferValidationMessage.location.invalidFormat })
  @IsNumber(
    {},
    { each: true, message: CreateOfferValidationMessage.location.invalidType }
  )
  public location: Location;

  @IsMongoId({ message: CreateOfferValidationMessage.userId.invalidId })
  public userId: string;
}
