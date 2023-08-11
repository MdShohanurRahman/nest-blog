import { IsEmail } from 'class-validator';
import { IsCustomPassword } from '../../validators/password-validatior';

export class RegisterRequestDto {
  @IsEmail()
  email: string;

  @IsCustomPassword()
  password: string;

  firstName: string;

  lastName: string;
}
