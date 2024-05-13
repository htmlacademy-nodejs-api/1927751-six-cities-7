import 'reflect-metadata';
import { Container } from 'inversify';

import { RestApplication } from './rest/rest.application.js';
import { ILogger, PinoLogger } from './shared/libs/logger/index.js';
import { IConfig, RestSchema, RestConfig } from './shared/libs/config/index.js';
import { Component } from './shared/types/index.js';
import {
  IDatabaseClient,
  MongoDatabaseClient,
} from './shared/libs/database-client/index.js';
import { createRestApplicationContainer } from './rest/rest.container.js';
import { createUserContainer } from './shared/modules/user/index.js';

async function bootstrap() {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer()
  );

  const application = appContainer.get<RestApplication>(
    Component.RestApplication
  );
  await application.init();
}

bootstrap();
