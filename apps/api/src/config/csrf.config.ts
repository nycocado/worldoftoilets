import { doubleCsrf } from 'csrf-csrf';

const csrfSecret =
  process.env.CSRF_SECRET || 'a-very-secure-and-random-secret-key';

export const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
  getSecret: () => csrfSecret,
  cookieName: 'x-csrf-token',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  },
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  getCsrfTokenFromRequest: (req) => req.headers['x-csrf-token'] as string,
  getSessionIdentifier: (req) => {
    return req.cookies?.['token'] || req.ip || 'anonymous';
  },
});
