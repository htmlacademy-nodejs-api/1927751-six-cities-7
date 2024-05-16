import dayjs from 'dayjs';

import { IOfferGenerator } from './offer-generator.interface.js';
import { MockServerData } from '../../types/index.js';
import {
  generateRandomBoolean,
  generateRandomNumber,
  getRandomItem,
  getRandomItems,
} from '../../helpers/index.js';
import {
  PRICE_CONSTRAINT,
  ROOMS_CONSTRAINT,
  GUESTS_CONSTRAINT,
  RATING_CONSTRAINT,
  FIRST_WEEK_DAY,
  LAST_WEEK_DAY,
} from './offer-generator.constant.js';

export class TSVOfferGenerator implements IOfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const city = getRandomItem<string>(this.mockData.cities);
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const previewImage = getRandomItem<string>(this.mockData.offerPreviews);
    const images = getRandomItems<string>(this.mockData.offerImages).join(';');
    const propertyType = getRandomItem<string>(this.mockData.propertyTypes);
    const supplies = getRandomItems<string>(this.mockData.supplies).join(';');
    const location = getRandomItem<string>(this.mockData.coordinates);

    const rating = generateRandomNumber(
      RATING_CONSTRAINT.MIN,
      RATING_CONSTRAINT.MAX,
      1
    ).toString();
    const rooms = generateRandomNumber(
      ROOMS_CONSTRAINT.MIN,
      ROOMS_CONSTRAINT.MAX
    ).toString();
    const guests = generateRandomNumber(
      GUESTS_CONSTRAINT.MIN,
      GUESTS_CONSTRAINT.MAX
    ).toString();
    const price = generateRandomNumber(
      PRICE_CONSTRAINT.MIN,
      PRICE_CONSTRAINT.MAX
    ).toString();

    const username = getRandomItem(this.mockData.users);
    const email = getRandomItem(this.mockData.emails);
    const avatarPath = getRandomItem(this.mockData.avatars);
    const userType = getRandomItem(this.mockData.userTypes);

    const postDate = dayjs()
      .subtract(generateRandomNumber(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();

    const isPremium = generateRandomBoolean();
    const isFavourite = generateRandomBoolean();

    const comments = 0;

    return [
      title,
      description,
      postDate,
      city,
      previewImage,
      images,
      isPremium,
      isFavourite,
      rating,
      propertyType,
      rooms,
      guests,
      price,
      supplies,
      username,
      email,
      avatarPath,
      userType,
      comments,
      location,
    ].join('\t');
  }
}
