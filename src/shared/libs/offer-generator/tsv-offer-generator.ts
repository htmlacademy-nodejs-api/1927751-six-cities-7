import dayjs from 'dayjs';

import { IOfferGenerator } from './offer-generator.interface.js';
import { MockServerData } from '../../types/index.js';
import {
  generateRandomBoolean,
  generateRandomNumber,
  getRandomItem,
  getRandomItems,
} from '../../helpers/index.js';

const MIN_PRICE = 100;
const MAX_PRICE = 100000;

const MIN_ROOMS = 1;
const MAX_ROOMS = 8;

const MIN_GUESTS = 1;
const MAX_GUESTS = 10;

const MIN_RATING = 1;
const MAX_RATING = 5;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

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

    const rating = generateRandomNumber(MIN_RATING, MAX_RATING, 1).toString();
    const rooms = generateRandomNumber(MIN_ROOMS, MAX_ROOMS).toString();
    const guests = generateRandomNumber(MIN_GUESTS, MAX_GUESTS).toString();
    const price = generateRandomNumber(MIN_PRICE, MAX_PRICE).toString();

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
