import { Injectable, ConflictException } from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { UserService } from '@modules/user';
import { UserCredentialService } from '@modules/user-credential/user-credential.service';
import { EmailVerificationService } from '@modules/email-verification/email-verification.service';
import { EmailService } from '@modules/email/email.service';
import { ConfigService } from '@nestjs/config';
import { UserIcon } from '@database/entities';
import { AUTH_EXCEPTIONS } from '@modules/auth/constants';

/**
 * Caso de Uso para Registo
 *
 * @class RegisterUseCase
 * @description Implementa a lógica de registo de nova conta de utilizador.
 * Cria utilizador, credenciais, token de verificação e envia email de verificação.
 *
 * @implements
 *   - Verificação de email único
 *   - Criação de utilizador com dados básicos
 *   - Criação de credenciais com password hasheada
 *   - Geração de token de verificação de email
 *   - Envio de email de verificação
 *
 * @example
 * await registerUseCase.execute(
 *   'João Silva',
 *   'joao@example.com',
 *   'password123',
 *   UserIcon.ICON_1,
 *   '1990-01-15'
 * );
 * // Cria utilizador e envia email de verificação
 *
 * @throws {ConflictException} Se email já estiver registado
 */
@Injectable()
export class RegisterUseCase {
  /**
   * Construtor do RegisterUseCase
   *
   * @param {UserService} userService - Serviço para operações de utilizador
   * @param {UserCredentialService} userCredentialService - Serviço para credenciais
   * @param {EmailVerificationService} emailVerificationService - Serviço para tokens de verificação
   * @param {EmailService} emailService - Serviço para envio de endereços eletrónicos
   * @param {ConfigService} configService - Serviço para ler configurações (FRONTEND_URL)
   */
  constructor(
    private readonly userService: UserService,
    private readonly userCredentialService: UserCredentialService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Executar caso de uso de registo
   *
   * @async
   * @param {string} name - Nome de utilizador (display name)
   * @param {string} email - Email único
   * @param {string} password - Password em texto plano (será hasheada)
   * @param {UserIcon | undefined} icon - Ícone/avatar (opcional)
   * @param {string} birthDate - Data de nascimento (ISO format)
   * @returns {Promise<void>}
   * @throws {ConflictException} Se email já estiver registado
   *
   * @description
   * 1. Verifica se email já existe
   * 2. Cria utilizador com nome, ícone e data de nascimento
   * 3. Cria credenciais com email e password hasheada
   * 4. Gera token de verificação de email
   * 5. Envia email de verificação com link
   */
  @Transactional()
  async execute(
    name: string,
    email: string,
    password: string,
    icon: UserIcon | undefined,
    birthDate: string,
  ): Promise<void> {
    if (await this.userService.verityUserExistsByEmail(email)) {
      throw new ConflictException(AUTH_EXCEPTIONS.EMAIL_ALREADY_IN_USE);
    }

    const user = await this.userService.createUser(name, icon, birthDate);

    const credential = await this.userCredentialService.createUserCredential(
      user,
      email,
      password,
    );

    const verification =
      await this.emailVerificationService.createVerificationToken(credential);

    const verificationUrl = `${this.configService.getOrThrow('FRONTEND_URL')}/auth/verify-email?token=${verification.token}`;

    await this.emailService.sendVerificationEmail(
      credential.email,
      user.name,
      verificationUrl,
    );
  }
}
