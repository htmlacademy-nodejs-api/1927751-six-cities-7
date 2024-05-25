import { Request, Response } from 'express';

import { inject, injectable } from 'inversify';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';

@injectable()
export class OfferController extends BaseController {
  constructor(@inject(Component.Logger) protected readonly logger: ILogger) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/create',
      method: HttpMethod.Post,
      handler: this.create,
    });
  }

  public index(req: Request, res: Response) {}

  public create(req: Request, res: Response) {}
}
