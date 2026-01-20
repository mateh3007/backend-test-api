import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
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
}

export class UpdateCompanyDto {
  @ApiPropertyOptional({
    description: 'Razão social da empresa',
    example: 'Nova Empresa LTDA',
  })
  @IsString()
  @IsOptional()
  corporateName?: string;

  @ApiPropertyOptional({
    description: 'CNPJ da empresa',
    example: '98.765.432/0001-10',
  })
  @IsString()
  @IsOptional()
  cnpj?: string;

  @ApiPropertyOptional({
    description: 'Telefone da empresa',
    example: '1144445555',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Email da empresa',
    example: 'novo@empresa.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;
}
