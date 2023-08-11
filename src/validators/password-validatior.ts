import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'passwordValidator', async: false })
export class PasswordValidator implements ValidatorConstraintInterface {
  validate(password: string): boolean {
    // Your custom password validation logic here
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    return regex.test(password);
  }

  defaultMessage(): string {
    return 'Password must be at least 8 characters, contain at least one uppercase letter, and at least one special character.';
  }
}

export function IsCustomPassword(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: PasswordValidator,
    });
  };
}
