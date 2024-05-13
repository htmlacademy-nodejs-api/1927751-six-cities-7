import { DocumentType } from '@typegoose/typegoose';
import { injectable, inject } from 'inversify';

import { IUserService } from './user-service.interface.js';
import { UserEntity, UserModel } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { Component } from '../../types/component.enum.js';
import { ILogger } from '../../libs/logger/index.js';

@injectable()
export class DefaultUserService implements IUserService {
  constructor(
    @inject(Component.UserService) private readonly logger: ILogger
  ) {}

  public async create(
    dto: CreateUserDto,
    salt: string
  ): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await UserModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }
}
