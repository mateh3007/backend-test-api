import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAdapter } from '../../../domain/adapters';

@Injectable()
export class JwtIntegration extends JwtAdapter {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  async sign(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async verify(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token);
  }
}

