import { IsEmail, IsNumberString, IsString, Length, IsOptional } from 'class-validator';

export class ForgotPasswordEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 6)
  @IsNumberString()
  code: string;

  @IsString()
  @Length(2, 2)
  @IsNumberString()
  expirationMinutes: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  orgName?: string;
}
