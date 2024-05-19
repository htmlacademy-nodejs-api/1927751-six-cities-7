import { types, DocumentType } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { ICommentService } from './comment-service.interface.js';
import { Component } from '../../types/component.enum.js';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { IOfferService } from '../offer/index.js';

@injectable()
export class DefaultCommentService implements ICommentService {
  constructor(
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.OfferService)
    private readonly offerService: IOfferService
  ) {}

  public async create(
    dto: CreateCommentDto
  ): Promise<DocumentType<CommentEntity> | null> {
    const offer = await this.offerService.incCommentCount(dto.offerId);
    if (!offer) {
      return null;
    }

    const comment = await this.commentModel.create(dto);

    this.offerService.updateRating(dto.offerId);

    return comment.populate('userId');
  }

  public async findByOfferId(
    offerId: string
  ): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel.find({ offerId }).populate('userId');
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel.deleteMany({ offerId }).exec();

    return result.deletedCount;
  }
}
