import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AddressableEnum } from '../../domain/enum';

export class CreateAddressDto {
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

  @ApiPropertyOptional({
    description: 'Complemento',
    example: 'Apto 45',
  })
  @IsString()
  @IsOptional()
  complement?: string;

  @ApiProperty({
    description: 'CEP',
    example: '01234-567',
  })
  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @ApiProperty({
    description: 'ID do proprietário do endereço (usuário ou empresa)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  addressableId: string;

  @ApiProperty({
    description: 'Tipo do proprietário do endereço',
    enum: AddressableEnum,
    example: AddressableEnum.USER,
  })
  @IsEnum(AddressableEnum)
  @IsNotEmpty()
  addressableType: AddressableEnum;
}

export class UpdateAddressDto {
  @ApiPropertyOptional({
    description: 'País',
    example: 'Brasil',
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({
    description: 'Estado/UF',
    example: 'RJ',
  })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({
    description: 'Cidade',
    example: 'Rio de Janeiro',
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({
    description: 'Rua/Logradouro',
    example: 'Avenida Atlântica',
  })
  @IsString()
  @IsOptional()
  street?: string;

  @ApiPropertyOptional({
    description: 'Número',
    example: '456',
  })
  @IsString()
  @IsOptional()
  number?: string;

  @ApiPropertyOptional({
    description: 'Complemento',
    example: 'Bloco A',
  })
  @IsString()
  @IsOptional()
  complement?: string;

  @ApiPropertyOptional({
    description: 'CEP',
    example: '22070-000',
  })
  @IsString()
  @IsOptional()
  zipCode?: string;
}
