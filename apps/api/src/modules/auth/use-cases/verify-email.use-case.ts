import { Injectable } from '@nestjs/common';
import { EmailVerificationService } from '@modules/email-verification/email-verification.service';
import { EmailService } from '@modules/email/email.service';
import { Transactional } from '@mikro-orm/mariadb';

/**
 * Caso de Uso para Verificação de Email
 *
 * @class VerifyEmailUseCase
 * @description Implementa a lógica de verificação de email via token.
 * Marca email como verificado e envia email de boas-vindas.
 *
 * @implements
 *   - Validação de token de verificação
 *   - Marcação de email como verificado
 *   - Envio de email de boas-vindas
 *
 * @example
 * await verifyEmailUseCase.execute('550e8400-e29b-41d4-a716-446655440000');
 * // Verifica email e envia email de boas-vindas
 *
 * @throws {BadRequestException} Se token inválido ou expirado
 */
@Injectable()
export class VerifyEmailUseCase {
  /**
   * Construtor do VerifyEmailUseCase
   *
   * @param {EmailVerificationService} emailVerificationService - Serviço para tokens de verificação
   * @param {EmailService} emailService - Serviço para envio de endereços eletrónicos
   */
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Executar caso de uso de verificação de email
   *
   * @async
   * @param {string} token - Token UUID de verificação
   * @returns {Promise<void>}
   * @throws {BadRequestException} Se token inválido, expirado ou já utilizado
   *
   * @description
   * 1. Valida e processa token de verificação
   * 2. Marca email como verificado na base de dados
   * 3. Envia email de boas-vindas ao utilizador
   */
  @Transactional()
  async execute(token: string): Promise<void> {
    const userCredential =
      await this.emailVerificationService.verifyToken(token);

    await this.emailService.sendWelcomeEmail(
      userCredential.email,
      userCredential.user.name,
    );
  }
}
