import { readFileSync } from 'node:fs';

import { IFileReader } from './file-reader.interface.js';
import {
  CityName,
  Location,
  IOffer,
  PropertyType,
  IUser,
  UserType,
} from '../../types/index.js';
import { SupplyType } from '../../types/supply-type.enum.js';

export class TSVFileReader implements IFileReader {
  private rawData = '';

  constructor(private readonly filename: string) {}

  private validateRawData(): void {
    if (!this.rawData) {
      throw new Error('File was not read');
    }
  }

  private parseRawDataToOffers(): IOffer[] {
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => this.parseLineToOffer(line));
  }

  private parseLineToOffer(line: string): IOffer {
    const [
      title,
      description,
      createdDate,
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
      password,
      userType,
      commentsCount,
      location,
    ] = line.split('\t');

    return {
      title,
      description,
      postDate: new Date(createdDate),
      city: city as CityName,
      previewImage,
      images: this.parseImages(images),
      isPremium: Boolean(isPremium),
      isFavourite: Boolean(isFavourite),
      rating: this.parseRating(rating),
      propertyType: propertyType as PropertyType,
      rooms: Number(rooms),
      guests: Number(guests),
      price: this.parsePrice(price),
      supplies: this.parseSupplies(supplies),
      commentsCount: Number(commentsCount),
      location: this.parseLocation(location),
      user: this.parseUser(
        username,
        email,
        avatarPath,
        password,
        userType as UserType
      ),
    };
  }

  private parseImages(imagesString: string): string[] {
    return imagesString.split(';');
  }

  private parseLocation(locationString: string): Location {
    const [latitude, longitude] = locationString.split(';');
    return {
      latitude: Number.parseFloat(latitude),
      longitude: Number.parseFloat(longitude),
    };
  }

  private parseSupplies(suppliesString: string): SupplyType[] {
    return suppliesString.split(';').map((name) => name as SupplyType);
  }

  private parsePrice(priceString: string): number {
    return Number.parseInt(priceString, 10);
  }

  private parseRating(ratingString: string): number {
    return Number(Number.parseFloat(ratingString).toFixed(1));
  }

  private parseUser(
    username: string,
    email: string,
    avatarPath: string,
    password: string,
    type: UserType
  ): IUser {
    return { username, email, password, type, avatarPath };
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): IOffer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
