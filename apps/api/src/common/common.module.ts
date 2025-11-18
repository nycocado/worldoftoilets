import { Global, Module } from '@nestjs/common';
import { CountryService } from '@common/services';
import {
  IsValidCountryConstraint,
  IsValidCountryCodeConstraint,
} from '@common/decorators';

@Global()
@Module({
  providers: [
    CountryService,
    IsValidCountryConstraint,
    IsValidCountryCodeConstraint,
  ],
  exports: [
    CountryService,
    IsValidCountryConstraint,
    IsValidCountryCodeConstraint,
  ],
})
export class CommonModule {}
