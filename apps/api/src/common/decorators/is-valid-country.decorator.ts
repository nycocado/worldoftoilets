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
export class IsValidCountryConstraint implements ValidatorConstraintInterface {
  constructor(private readonly countryService: CountryService) {}

  validate(countryName: string) {
    if (!countryName) return false;
    return this.countryService.isValidCountryName(countryName);
  }

  defaultMessage() {
    return 'Invalid country name. Please provide a valid country name in Portuguese, English, or Spanish.';
  }
}

export function IsValidCountry(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidCountryConstraint,
    });
  };
}
