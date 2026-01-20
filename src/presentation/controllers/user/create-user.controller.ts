import { Body, Controller, Post } from '@nestjs/common';
import { Roles } from '../../../infra/commons/decorators';
import { RoleEnum } from '../../../domain/enum';
import { CreateUserUseCase } from '../../../use-cases/users';
import { CreateUserDto } from '../../dtos';
import { BaseController, IApiResponse } from '../base.controller';
import { ICreateUserOutput } from '../../../domain/interfaces';

@Controller('users')
export class CreateUserController extends BaseController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {
    super();
  }

  @Post()
  @Roles(RoleEnum.COMPANY_OWNER)
  async handle(@Body() dto: CreateUserDto): Promise<IApiResponse<ICreateUserOutput>> {
    const result = await this.createUserUseCase.execute(dto);
    return this.created(result);
  }
}

