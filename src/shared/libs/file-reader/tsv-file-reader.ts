import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';

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

export class TSVFileReader extends EventEmitter implements IFileReader {
  private CHUNK_SIZE = 16384;

  constructor(private readonly filename: string) {
    super();
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
      latitude: Number.parseFloat(latitude ?? 0),
      longitude: Number.parseFloat(longitude ?? 0),
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
    type: UserType
  ): IUser {
    return { username, email, type, avatarPath };
  }

  public async read() {
    const readStream = createReadStream(this.filename, {
      highWaterMark: this.CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        const parsedOffer = this.parseLineToOffer(completeRow);

        await new Promise((resolve) => {
          this.emit('line', parsedOffer, resolve);
        });
      }
    }

    this.emit('end', importedRowCount);
  }
}
