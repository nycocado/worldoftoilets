import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { CountryService } from '@common/services';

@ValidatorConstraint({ async: false })
@Injectable()
export class IsValidCountryCodeConstraint implements ValidatorConstraintInterface {
  constructor(private readonly countryService: CountryService) {}

  validate(countryCode: string) {
    if (!countryCode) return false;
    return this.countryService.isValidCountryCode(countryCode);
  }

  defaultMessage() {
    return 'Invalid country code. Please provide a valid ISO 3166-1 alpha-2 country code (e.g., PT, BR, US).';
  }
}

export function IsValidCountryCode(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidCountryCodeConstraint,
    });
  };
}
