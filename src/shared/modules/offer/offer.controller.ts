import { Request, Response } from 'express';

import { inject, injectable } from 'inversify';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { IOfferService } from './offer-service.interface.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: ILogger,
    @inject(Component.OfferService)
    protected readonly offerService: IOfferService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/create',
      method: HttpMethod.Post,
      handler: this.create,
    });
  }

  public async index(_req: Request, res: Response) {
    const offers = await this.offerService.find();

    this.ok(res, offers);
  }

  public create(_req: Request, _res: Response) {}
}
