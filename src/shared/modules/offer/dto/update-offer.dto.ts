import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsObject,
  Max,
  MaxLength,
  Min,
  MinLength,
  IsOptional
} from 'class-validator';
import {
  CityName,
  Location,
  PropertyType,
  SupplyType,
} from '../../../types/index.js';
import { CreateOfferValidationMessage } from './create-offer.messages.js';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(10, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateOfferValidationMessage.title.maxLength })
  public title?: string;

  @IsOptional()
  @MinLength(20, {
    message: CreateOfferValidationMessage.description.minLength,
  })
  @MaxLength(1024, {
    message: CreateOfferValidationMessage.description.maxLength,
  })
  public description?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: CreateOfferValidationMessage.postDate.invalidFormat }
  )
  public postDate?: Date;

  @IsOptional()
  @IsEnum(CityName, { message: CreateOfferValidationMessage.city.invalid })
  public city?: CityName;

  @IsOptional()
  //TODO: make it longer
  @MinLength(10, {
    message: CreateOfferValidationMessage.previewImage.minLength,
  })
  public previewImage?: string;

  @IsOptional()
  @IsArray({ message: CreateOfferValidationMessage.images.invalidFormat })
  @MinLength(10, {
    each: true,
    message: CreateOfferValidationMessage.images.minLength,
  })
  public images?: string[];

  @IsOptional()
  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalid })
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(PropertyType, {
    message: CreateOfferValidationMessage.propertyType.invalid,
  })
  public propertyType?: PropertyType;

  @IsOptional()
  @IsInt({ message: CreateOfferValidationMessage.rooms.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.rooms.minValue })
  @Max(8, { message: CreateOfferValidationMessage.rooms.maxValue })
  public rooms?: number;

  @IsOptional()
  @IsInt({ message: CreateOfferValidationMessage.guests.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.guests.minValue })
  @Max(10, { message: CreateOfferValidationMessage.guests.maxValue })
  public guests?: number;

  @IsOptional()
  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: CreateOfferValidationMessage.price.minValue })
  @Max(100000, { message: CreateOfferValidationMessage.price.maxValue })
  public price?: number;

  @IsOptional()
  @IsArray({ message: CreateOfferValidationMessage.supplies.invalidFormat })
  @IsEnum(SupplyType, {
    each: true,
    message: CreateOfferValidationMessage.supplies.invalidFormat,
  })
  public supplies?: SupplyType[];

  @IsOptional()
  //TODO: how validate coordinates???
  @IsObject({ message: CreateOfferValidationMessage.location.invalidFormat })
  public location?: Location;
}
