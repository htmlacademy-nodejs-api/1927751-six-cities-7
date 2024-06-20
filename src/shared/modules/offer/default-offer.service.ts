import mongoose from 'mongoose';
import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';

import { IOfferService } from './offer-service.interface.js';
import { Component, SortType } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import {
  DEFAULT_OFFER_COUNT,
  MAX_PREMIUM_OFFER_COUNT,
} from './offer.constant.js';

@injectable()
export class DefaultOfferService implements IOfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).populate(['userId']).exec();
  }

  public async find(count?: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? DEFAULT_OFFER_COUNT;

    return this.offerModel
      .find()
      .sort({ createdAt: SortType.Down })
      .limit(limit)
      .populate(['userId'])
      .exec();
  }

  public async findPremium(): Promise<DocumentType<OfferEntity>[]> {
    const limit = MAX_PREMIUM_OFFER_COUNT;

    return this.offerModel
      .find({ isPremium: true })
      .sort({ createdAt: SortType.Down })
      .limit(limit)
      .populate(['userId'])
      .exec();
  }

  public async findFavourite(
    offerIds: string[]
  ): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({ _id: { $in: offerIds } }).exec();
  }

  public async deleteById(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId).exec();
  }

  public async updateById(
    offerId: string,
    dto: UpdateOfferDto
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate(['userId'])
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }

  public async incCommentCount(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        $inc: {
          commentCount: 1,
        },
      })
      .exec();
  }

  public async getRating(offerId: string): Promise<number> {
    const id = new mongoose.Types.ObjectId(offerId);

    const result = await this.offerModel
      .aggregate([
        {
          $match: { _id: id },
        },
        {
          $lookup: {
            from: 'comments',
            let: { offerId: '$_id' },
            pipeline: [
              { $match: { offerId: id } },
              { $project: { _id: null, rating: 1 } },
            ],
            as: 'comments',
          },
        },
        {
          $addFields: {
            commentsLength: { $size: '$comments' },
            commentsSum: {
              $reduce: {
                input: '$comments',
                initialValue: 0,
                in: { $sum: ['$$value', '$$this.rating'] },
              },
            },
          },
        },
        {
          $addFields: {
            rating: {
              $round: [{ $divide: ['$commentsSum', '$commentsLength'] }, 1],
            },
          },
        },
        { $unset: ['commentsLength', 'commentsSum', 'comments'] },
      ])
      .exec();

    return result?.[0]?.rating ?? null;
  }

  public async updateRating(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    const rating = await this.getRating(offerId);

    if (!rating) {
      return null;
    }

    return this.offerModel
      .findByIdAndUpdate(
        offerId,
        {
          $set: {
            rating: rating,
          },
        },
        { new: true }
      )
      .exec();
  }
}
