/**
 * Constantes de Mensagens de Autenticação
 *
 * @constant AUTH_MESSAGES
 * @description Mensagens de sucesso utilizadas nas respostas bem-sucedidas de autenticação.
 * Mantém consistência nas mensagens e facilita internacionalização (i18n).
 *
 * @property {string} LOGIN_SUCCESS - Login realizado com sucesso
 * @property {string} REFRESH_SUCCESS - Renovação de access token bem-sucedida
 * @property {string} LOGOUT_SUCCESS - Logout de sessão específica bem-sucedido
 * @property {string} LOGOUT_ALL_SUCCESS - Logout de todas as sessões bem-sucedido
 * @property {string} REGISTER_SUCCESS - Registo realizado, verificação de email pendente
 * @property {string} VERIFY_EMAIL_SUCCESS - Email verificado com sucesso, pode fazer login
 * @property {string} RESEND_VERIFICATION_SUCCESS - Email de verificação reenviado com sucesso
 * @property {string} FORGOT_PASSWORD_SUCCESS - Email de reinício de password enviado (se existir)
 * @property {string} RESET_PASSWORD_SUCCESS - Password alterada com sucesso, pode fazer login
 */
export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful.',
  REFRESH_SUCCESS: 'Access token renewed successfully.',
  LOGOUT_SUCCESS: 'Logout successful.',
  LOGOUT_ALL_SUCCESS: 'All sessions logged out successfully.',
  REGISTER_SUCCESS:
    'Registration successful. Check your email to activate your account.',
  VERIFY_EMAIL_SUCCESS: 'Email verified successfully. You can now login.',
  RESEND_VERIFICATION_SUCCESS: 'Verification email resent successfully.',
  FORGOT_PASSWORD_SUCCESS:
    'If the email exists, you will receive instructions to reset your password.',
  RESET_PASSWORD_SUCCESS: 'Password reset successfully. You can now login.',
};
