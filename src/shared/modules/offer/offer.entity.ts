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
  @prop({ trim: true, required: true })
  public title: string;

  @prop({ trim: true })
  public description!: string;

  @prop()
  public postDate: Date;

  @prop({
    type: () => String,
    enum: CityName,
  })
  public city: CityName;

  @prop()
  public previewImage: string;

  @prop({ default: [] })
  public images: string[];

  @prop({ default: false })
  public isPremium: boolean;

  @prop({ default: false })
  public isFavourite: boolean;

  @prop({ default: 0 })
  public rating: number;

  @prop({
    type: () => String,
    enum: PropertyType,
  })
  public propertyType: PropertyType;

  @prop({ required: true, default: 1 })
  public rooms: number;

  @prop({ required: true, default: 1 })
  public guests: number;

  @prop({ required: true, default: 0 })
  public price: number;

  @prop({ required: true, default: [] })
  public supplies: SupplyType[];

  @prop({ default: 0 })
  public commentsCount: number;

  @prop({ required: true, default: { latitude: 0, longitude: 0 } })
  public location: Location;

  @prop({
    ref: UserEntity,
    required: true,
  })
  public userId: Ref<UserEntity>;
}

export const OfferModel = getModelForClass(OfferEntity);
