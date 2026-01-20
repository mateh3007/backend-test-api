import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from '../../../infra/commons/decorators';
import { LoginUseCase } from '../../../use-cases/auth';
import { LoginDto } from '../../dtos';
import { BaseController, IApiResponse } from '../base.controller';
import { ILoginOutput } from '../../../domain/interfaces';

@Controller('auth')
export class LoginController extends BaseController {
  constructor(private readonly loginUseCase: LoginUseCase) {
    super();
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async handle(@Body() dto: LoginDto): Promise<IApiResponse<ILoginOutput>> {
    const result = await this.loginUseCase.execute(dto);
    return this.success(result);
  }
}
