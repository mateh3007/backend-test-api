import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterCompanyDto {
  // Dados da empresa
  @ApiProperty({
    description: 'Razão social da empresa',
    example: 'Empresa LTDA',
  })
  @IsString()
  @IsNotEmpty()
  corporateName: string;

  @ApiProperty({
    description: 'CNPJ da empresa',
    example: '12.345.678/0001-90',
  })
  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @ApiProperty({
    description: 'Telefone da empresa',
    example: '1133334444',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Email da empresa',
    example: 'contato@empresa.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // Dados do dono
  @ApiProperty({
    description: 'Nome completo do dono da empresa',
    example: 'João Silva',
  })
  @IsString()
  @IsNotEmpty()
  ownerName: string;

  @ApiProperty({
    description: 'Email do dono da empresa',
    example: 'joao@empresa.com',
  })
  @IsEmail()
  @IsNotEmpty()
  ownerEmail: string;

  @ApiProperty({
    description: 'Senha do dono (mínimo 6 caracteres)',
    example: 'senha123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  ownerPassword: string;

  @ApiProperty({
    description: 'Telefone do dono',
    example: '11999999999',
  })
  @IsString()
  @IsNotEmpty()
  ownerPhone: string;
}

export class CreateAddressOnboardingDto {
  @ApiProperty({
    description: 'País',
    example: 'Brasil',
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    description: 'Estado/UF',
    example: 'SP',
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    description: 'Cidade',
    example: 'São Paulo',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'Rua/Logradouro',
    example: 'Rua das Flores',
  })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({
    description: 'Número',
    example: '123',
  })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({
    description: 'CEP',
    example: '01234-567',
  })
  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @ApiPropertyOptional({
    description: 'Complemento',
    example: 'Apto 45',
  })
  @IsString()
  @IsOptional()
  complement?: string;
}

