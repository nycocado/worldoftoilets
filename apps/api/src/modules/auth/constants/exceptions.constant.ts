/**
 * Constantes de Exceções de Autenticação
 *
 * @constant AUTH_EXCEPTIONS
 * @description Mensagens de erro utilizadas nos endpoints de autenticação.
 * Utilizadas para manter consistência nas respostas de erro e facilitar i18n.
 *
 * @property {string} INVALID_CREDENTIALS - Credenciais (email/password) inválidas
 * @property {string} EMAIL_NOT_VERIFIED - Email não foi verificado pelo utilizador
 * @property {string} REFRESH_TOKEN_INVALID - Refresh token inválido ou corrompido
 * @property {string} REFRESH_TOKEN_EXPIRED - Refresh token expirou
 * @property {string} REFRESH_TOKEN_REQUIRED - Refresh token é obrigatório para a operação
 * @property {string} TOKEN_REQUIRED - Token é obrigatório para a operação
 * @property {string} USER_NOT_FOUND - Utilizador não existe no sistema
 * @property {string} EMAIL_ALREADY_IN_USE - Email já está registado
 * @property {string} EMAIL_ALREADY_VERIFIED - Email já foi verificado anteriormente
 */
export const AUTH_EXCEPTIONS = {
  INVALID_CREDENTIALS: 'Invalid credentials.',
  EMAIL_NOT_VERIFIED: 'Email not verified.',
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required for logout.',
  TOKEN_REQUIRED: 'Token is required.',
  EMAIL_ALREADY_IN_USE: 'Email already in use.',
  EMAIL_ALREADY_VERIFIED: 'Email already verified.',
};
