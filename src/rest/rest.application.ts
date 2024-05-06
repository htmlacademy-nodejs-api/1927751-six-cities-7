import { ILogger } from '../shared/libs/logger/index.js';
import { IConfig } from '../shared/libs/config/index.js';

export class RestApplication {
  constructor(
    private readonly logger: ILogger,
    private readonly config: IConfig
  ) {}

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
  }
}
