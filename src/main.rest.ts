import 'reflect-metadata';
import { Container } from 'inversify';

import { RestApplication } from './rest/rest.application.js';
import { ILogger, PinoLogger } from './shared/libs/logger/index.js';
import { IConfig, RestSchema, RestConfig } from './shared/libs/config/index.js';
import { Component } from './shared/types/index.js';
import { IDatabaseClient, MongoDatabaseClient } from './shared/libs/database-client/index.js';

async function bootstrap() {
  const container = new Container();
  container.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  container.bind<ILogger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<IConfig<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  container.bind<IDatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();

  const application = container.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();
