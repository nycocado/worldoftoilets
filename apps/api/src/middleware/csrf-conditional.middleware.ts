import { Injectable, NestMiddleware } from '@nestjs/common';
import { doubleCsrfProtection } from '@config/csrf.config';

@Injectable()
export class CsrfConditionalMiddleware implements NestMiddleware {
  use = (req: any, res: any, next: () => void) => {
    const isBrowser = Boolean(req.cookies?.['refresh_token']);

    if (isBrowser) {
      return doubleCsrfProtection(req, res, next);
    }

    return next();
  };
}
