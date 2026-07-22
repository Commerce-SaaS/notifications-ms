import {
  IsEmail,
  IsString,
  IsOptional,
} from 'class-validator';

export class EmailChangedDto {
  @IsEmail()
  email: string;

  @IsEmail()
  newEmail: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  orgName?: string;
}
