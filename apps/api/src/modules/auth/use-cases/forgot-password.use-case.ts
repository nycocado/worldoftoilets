import { Injectable } from '@nestjs/common';
import { UserService } from '@modules/user';
import { PasswordResetService } from '@modules/password-reset/password-reset.service';
import { EmailService } from '@modules/email/email.service';
import { ConfigService } from '@nestjs/config';

/**
 * Caso de Uso para Recuperação de Password
 *
 * @class ForgotPasswordUseCase
 * @description Implementa a lógica de recuperação de password.
 * Gera token de reset de password e envia email com link.
 * Por segurança, não revela se email existe.
 *
 * @implements
 *   - Procura utilizador por email
 *   - Criação de token de reset de password
 *   - Envio de email com link de reset
 *   - Falha silenciosa se email não existir (segurança)
 *
 * @example
 * await forgotPasswordUseCase.execute('joao@example.com');
 * // Envia email com link de reset se email existir
 *
 * @returns {Promise<void>} Sempre retorna sucesso (por segurança)
 */
@Injectable()
export class ForgotPasswordUseCase {
  /**
   * Construtor do ForgotPasswordUseCase
   *
   * @param {UserService} userService - Serviço para operações de utilizador
   * @param {PasswordResetService} passwordResetService - Serviço para tokens de reset
   * @param {EmailService} emailService - Serviço para envio de endereços eletrónicos
   * @param {ConfigService} configService - Serviço para ler configurações (FRONTEND_URL)
   */
  constructor(
    private readonly userService: UserService,
    private readonly passwordResetService: PasswordResetService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Executar caso de uso de recuperação de password
   *
   * @async
   * @param {string} email - Email do utilizador
   * @returns {Promise<void>} Sempre retorna sucesso (por segurança)
   *
   * @description
   * 1. Procura utilizador pelo email (falha silenciosa se não existe)
   * 2. Gera token de reset de password
   * 3. Constrói URL com token de reset
   * 4. Envia email com link de reset
   *
   * Por segurança, esta função sempre retorna sucesso mesmo que email não exista.
   * Isto previne que atacantes descubram quais emails estão registados.
   */
  async execute(email: string): Promise<void> {
    const user = await this.userService.getByEmail(email);

    if (!user) {
      return;
    }

    if (user.credential) {
      const reset = await this.passwordResetService.createResetToken(
        user.credential,
      );

      const resetUrl = `${this.configService.getOrThrow('FRONTEND_URL')}/auth/reset-password?token=${reset.token}`;

      await this.emailService.sendPasswordResetEmail(
        email,
        user.name,
        resetUrl,
      );
    }
  }
}
