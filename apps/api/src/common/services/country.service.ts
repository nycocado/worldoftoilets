import { Injectable, OnModuleInit } from '@nestjs/common';
import * as countries from 'i18n-iso-countries';
import pt from 'i18n-iso-countries/langs/pt.json';
import en from 'i18n-iso-countries/langs/en.json';
import es from 'i18n-iso-countries/langs/es.json';

@Injectable()
export class CountryService implements OnModuleInit {
  private readonly languages = ['pt', 'en', 'es'];

  onModuleInit() {
    countries.registerLocale(pt);
    countries.registerLocale(en);
    countries.registerLocale(es);
  }

  getCountryCode(countryName: string): string | undefined {
    if (!countryName) return undefined;

    const normalizedName = countryName.trim();

    for (const lang of this.languages) {
      const code = countries.getAlpha2Code(normalizedName, lang);
      if (code) return code;
    }

    return undefined;
  }

  isValidCountryCode(countryCode: string): boolean {
    if (!countryCode || countryCode.length !== 2) return false;
    return countries.isValid(countryCode.toUpperCase());
  }

  isValidCountryName(countryName: string): boolean {
    return this.getCountryCode(countryName) !== undefined;
  }
}
