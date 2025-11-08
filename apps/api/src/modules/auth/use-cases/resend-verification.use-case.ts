import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from '@modules/user';
import { EmailVerificationService } from '@modules/email-verification/email-verification.service';
import { EmailService } from '@modules/email/email.service';
import { ConfigService } from '@nestjs/config';
import { AUTH_EXCEPTIONS } from '@modules/auth/constants';

/**
 * Caso de Uso para Reenvio de Email de Verificação
 *
 * @class ResendVerificationUseCase
 * @description Implementa a lógica de reenvio do email de verificação.
 * Valida utilizador e email, e reenvia token de verificação.
 *
 * @implements
 *   - Procura utilizador por email
 *   - Verifica se email não foi verificado
 *   - Gera novo token de verificação
 *   - Envia email de verificação com link
 *
 * @example
 * await resendVerificationUseCase.execute('joao@example.com');
 * // Reenvia email de verificação
 *
 * @throws {BadRequestException} Se utilizador não existe ou email já verificado
 */
@Injectable()
export class ResendVerificationUseCase {
  /**
   * Construtor do ResendVerificationUseCase
   *
   * @param {UserService} userService - Serviço para operações de utilizador
   * @param {EmailVerificationService} emailVerificationService - Serviço para tokens de verificação
   * @param {EmailService} emailService - Serviço para envio de endereços eletrónicos
   * @param {ConfigService} configService - Serviço para ler configurações (FRONTEND_URL)
   */
  constructor(
    private readonly userService: UserService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Executar caso de uso de reenvio de email de verificação
   *
   * @async
   * @param {string} email - Email do utilizador
   * @returns {Promise<void>}
   * @throws {BadRequestException} Se utilizador não existe ou email já verificado
   *
   * @description
   * 1. Procura utilizador pelo email
   * 2. Valida se email já foi verificado
   * 3. Gera novo token de verificação
   * 4. Constrói URL com token
   * 5. Reenvia email de verificação
   */
  async execute(email: string): Promise<void> {
    const user = await this.userService.getByEmail(email);

    if (!user) {
      throw new BadRequestException(AUTH_EXCEPTIONS.USER_NOT_FOUND);
    }

    if (!user.credential) {
      return;
    }

    if (user.credential.emailVerified) {
      throw new BadRequestException(AUTH_EXCEPTIONS.EMAIL_ALREADY_VERIFIED);
    }

    const verification =
      await this.emailVerificationService.createVerificationToken(
        user.credential,
      );

    const verificationUrl = `${this.configService.getOrThrow('FRONTEND_URL')}/auth/verify-email?token=${verification.token}`;

    await this.emailService.sendVerificationEmail(
      email,
      user.name,
      verificationUrl,
    );
  }
}
