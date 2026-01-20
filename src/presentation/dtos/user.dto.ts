import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { RoleEnum } from '../../domain/enum';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'Maria Santos',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'maria@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo 6 caracteres)',
    example: 'senha123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Telefone do usuário',
    example: '11999999999',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Papel/função do usuário',
    enum: RoleEnum,
    example: RoleEnum.USER,
  })
  @IsEnum(RoleEnum)
  @IsNotEmpty()
  role: RoleEnum;

  @ApiPropertyOptional({
    description: 'ID da empresa (para usuários vinculados a empresas)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsOptional()
  companyId?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Nome completo do usuário',
    example: 'Maria Santos',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Email do usuário',
    example: 'maria@email.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Senha do usuário (mínimo 6 caracteres)',
    example: 'novaSenha123',
    minLength: 6,
  })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({
    description: 'Telefone do usuário',
    example: '11988888888',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Papel/função do usuário',
    enum: RoleEnum,
    example: RoleEnum.USER,
  })
  @IsEnum(RoleEnum)
  @IsOptional()
  role?: RoleEnum;

  @ApiPropertyOptional({
    description: 'ID da empresa',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsOptional()
  companyId?: string;
}
