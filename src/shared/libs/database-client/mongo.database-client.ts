// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as Mongoose from 'mongoose';
import { injectable, inject } from 'inversify';

import { Component } from '../../types/index.js';
import { IDatabaseClient } from './database-client.interface.js';
import { ILogger } from '../logger/index.js';

@injectable()
export class MongoDatabaseClient implements IDatabaseClient {
  private mongoose: typeof Mongoose | null;
  private isConnected: boolean;

  constructor(@inject(Component.Logger) private readonly logger: ILogger) {
    this.isConnected = false;
    this.mongoose = null;
  }

  public isConnectedToDatabase() {
    return this.isConnected;
  }

  public async connect(url: string): Promise<void> {
    if (this.isConnectedToDatabase()) {
      throw new Error('MongoDB client is already connected');
    }

    this.logger.info('Trying to connect to MongoDB...');

    this.mongoose = await Mongoose.connect(url);
    this.isConnected = true;

    this.logger.info('Database connection is established');
  }

  public async disconnect(): Promise<void> {
    this.isConnected = false;
    this.logger.info('Database connection is closed');
  }
}
