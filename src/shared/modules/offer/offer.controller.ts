import { Request, Response } from 'express';

import { inject, injectable } from 'inversify';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpMethod,
  ValidateDtoMiddleware,
  PrivateRouteMiddleware,
  HttpError,
} from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { IOfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { ParamOfferId } from './type/param-offerid.type.js';
import { CreateOfferRequest } from './type/create-offer-request.type.js';
import { RequestQuery } from '../../libs/rest/types/request-query.type.js';
import { ICommentService } from '../comment/comment-service.interface.js';
import { CommentRdo } from '../comment/rdo/comment.rdo.js';
import { ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { IUserService } from '../user/user-service.interface.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: ILogger,
    @inject(Component.OfferService)
    protected readonly offerService: IOfferService,
    @inject(Component.CommentService)
    protected readonly commentService: ICommentService,
    @inject(Component.UserService) private readonly userService: IUserService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto),
      ],
    });

    this.addRoute({
      path: '/premium',
      method: HttpMethod.Get,
      handler: this.premium,
    });

    this.addRoute({
      path: '/favourites',
      method: HttpMethod.Get,
      handler: this.favourites,
      middlewares: [new PrivateRouteMiddleware()],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId/favourite',
      method: HttpMethod.Post,
      handler: this.updateFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'offer', 'offerId'),
      ],
    });
  }

  public async index(
    { query }: Request<unknown, unknown, unknown, RequestQuery>,
    res: Response
  ): Promise<void> {
    const offers = await this.offerService.find(query.limit);

    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async premium(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findPremium();

    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async show(
    { params }: Request<ParamOfferId>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;

    const offers = await this.offerService.findById(offerId);

    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async create(
    { body, tokenPayload }: CreateOfferRequest,
    res: Response
  ) {
    const result = await this.offerService.create({
      ...body,
      userId: tokenPayload.id,
    });
    const offer = await this.offerService.findById(result.id);

    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async update(
    { params, body }: Request<ParamOfferId, unknown, UpdateOfferDto>,
    res: Response
  ) {
    const { offerId } = params;

    const updatedOffer = await this.offerService.updateById(offerId, body);

    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response) {
    const { offerId } = params;
    const offer = await this.offerService.deleteById(offerId);

    await this.commentService.deleteByOfferId(offerId);

    this.noContent(res, fillDTO(OfferRdo, offer));
  }

  public async getComments(
    { params }: Request<ParamOfferId>,
    res: Response
  ): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  private async updateFavorites(
    { params, tokenPayload }: Request<ParamOfferId>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;

    const user = await this.userService.findByEmail(tokenPayload.email);

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    let favorites = user.favourites ?? [];
    let isFavourite = false;

    if (favorites.includes(offerId)) {
      favorites = favorites.filter((id) => id !== offerId);
    } else {
      favorites = [...favorites, offerId];
      isFavourite = true;
    }

    await this.userService.updateFavourites(tokenPayload.id, favorites);

    this.created(res, { isFavourite });
  }

  public async favourites(
    { tokenPayload }: Request,
    res: Response
  ): Promise<void> {
    const user = await this.userService.findByEmail(tokenPayload.email);

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    const favouriteOfferIds = user.favourites ?? [];

    const offers = await this.offerService.findFavourite(favouriteOfferIds);

    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }
}
