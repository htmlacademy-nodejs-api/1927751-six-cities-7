import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';

import {
  CityName,
  Location,
  PropertyType,
  SupplyType,
} from '../../types/index.js';
import { UserEntity } from '../user/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  },
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, trim: true })
  public title: string;

  @prop({ required: true, trim: true })
  public description: string;

  @prop({ required: true })
  public postDate: Date;

  @prop({
    required: true,
    type: () => String,
    enum: CityName,
  })
  public city: CityName;

  @prop({ required: true })
  public previewImage: string;

  @prop({ required: true, default: [] })
  public images: string[];

  @prop({ required: true, default: false })
  public isPremium: boolean;

  @prop({ required: true, default: false })
  public isFavourite: boolean;

  @prop({ required: true, default: 1 })
  public rating: number;

  @prop({
    required: true,
    type: () => String,
    enum: PropertyType,
  })
  public propertyType: PropertyType;

  @prop({ required: true, default: 1 })
  public rooms: number;

  @prop({ required: true, default: 1 })
  public guests: number;

  @prop({ required: true, default: 100 })
  public price: number;

  @prop({ required: true, default: [] })
  public supplies: SupplyType[];

  @prop({ default: 0 })
  public commentCount: number;

  @prop({ required: true, default: { latitude: 0, longitude: 0 } })
  public location: Location;

  @prop({
    ref: UserEntity,
    required: true,
  })
  public userId: Ref<UserEntity>;
}

export const OfferModel = getModelForClass(OfferEntity);
