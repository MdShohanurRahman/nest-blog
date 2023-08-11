import { IsEmail } from 'class-validator';
import { IsCustomPassword } from '../../validators/password-validatior';

export class UserCreateRequestDto {
  @IsEmail()
  email: string;

  @IsCustomPassword()
  password: string;
}
