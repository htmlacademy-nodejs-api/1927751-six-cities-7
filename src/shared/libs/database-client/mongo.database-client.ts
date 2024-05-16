// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as Mongoose from 'mongoose';
import { injectable, inject } from 'inversify';
import { setTimeout } from 'node:timers/promises';

import { Component } from '../../types/index.js';
import { IDatabaseClient } from './database-client.interface.js';
import { ILogger } from '../logger/index.js';

const RETRY_COUNT = 5;
const RETRY_TIMEOUT = 1000;

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

  public async connect(mongoURL: string): Promise<void> {
    if (this.isConnectedToDatabase()) {
      throw new Error('MongoDB client is already connected');
    }

    this.logger.info('Trying to connect to MongoDB...');

    let attempt = 0;
    while (attempt < RETRY_COUNT) {
      try {
        this.mongoose = await Mongoose.connect(mongoURL);
        this.isConnected = true;
        this.logger.info('Database connection established.');
        return;
      } catch (error) {
        attempt++;
        this.logger.error(
          `Failed to connect to the database. Attempt ${attempt}`,
          error as Error
        );
        await setTimeout(RETRY_TIMEOUT);
      }
    }

    throw new Error(
      `Unable to establish database connection after ${RETRY_COUNT}`
    );
  }

  public async disconnect(): Promise<void> {
    this.isConnected = false;
    this.logger.info('Database connection is closed');
  }
}
