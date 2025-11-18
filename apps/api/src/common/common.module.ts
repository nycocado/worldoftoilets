import { Global, Module } from '@nestjs/common';
import { CountryService, ImageValidationService } from '@common/services';
import {
  IsValidCountryConstraint,
  IsValidCountryCodeConstraint,
} from '@common/decorators';

@Global()
@Module({
  providers: [
    CountryService,
    ImageValidationService,
    IsValidCountryConstraint,
    IsValidCountryCodeConstraint,
  ],
  exports: [
    CountryService,
    ImageValidationService,
    IsValidCountryConstraint,
    IsValidCountryCodeConstraint,
  ],
})
export class CommonModule {}
