/**
 * Contém as mensagens de exceção para o módulo de autenticação.
 */
export const AUTH_EXCEPTIONS = {
  INVALID_CREDENTIALS: 'Invalid credentials.',
  EMAIL_NOT_VERIFIED: 'Email not verified.',
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required for logout.',
  TOKEN_REQUIRED: 'Token is required.',
  EMAIL_ALREADY_IN_USE: 'Email already in use.',
  EMAIL_ALREADY_VERIFIED: 'Email already verified.',
  USER_DEACTIVATED: 'User account has been deactivated.',
  WEAK_PASSWORD:
    'Password too weak. It must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.',
};
