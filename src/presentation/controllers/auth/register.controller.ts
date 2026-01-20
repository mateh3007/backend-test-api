import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../../../infra/commons/decorators';
import { RegisterUseCase } from '../../../use-cases/auth';
import { RegisterDto } from '../../dtos';
import { BaseController, IApiResponse } from '../base.controller';
import { IRegisterOutput } from '../../../domain/interfaces';

@Controller('auth')
export class RegisterController extends BaseController {
  constructor(private readonly registerUseCase: RegisterUseCase) {
    super();
  }

  @Public()
  @Post('register')
  async handle(@Body() dto: RegisterDto): Promise<IApiResponse<IRegisterOutput>> {
    const result = await this.registerUseCase.execute(dto);
    return this.created(result);
  }
}

