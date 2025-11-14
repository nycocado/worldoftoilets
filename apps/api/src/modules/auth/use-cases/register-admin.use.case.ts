import { ConflictException, Injectable } from '@nestjs/common';
import { RoleApiName, UserIcon } from '@database/entities';
import { UserService } from '@modules/user';
import { RoleService } from '@modules/role';
import { UserCredentialService } from '@modules/user-credential';
import { EmailVerificationService } from '@modules/email-verification';
import { EmailService } from '@modules/email';
import { ConfigService } from '@nestjs/config';
import { AUTH_EXCEPTIONS } from '@modules/auth/constants';

/**
 * Caso de Uso para Registo de Administrador
 *
 * @class RegisterAdminUseCase
 * @description Implementa a lógica de registo de nova conta de administrador.
 * Cria utilizador com roles administrativas específicas, credenciais, token de verificação e envia email de verificação.
 *
 * @implements
 *   - Verificação de email único
 *   - Criação de utilizador com dados básicos
 *   - Atribuição de roles administrativas personalizadas
 *   - Criação de credenciais com password hasheada
 *   - Geração de token de verificação de email
 *   - Envio de email de verificação
 *
 * @example
 * await registerAdminUseCase.execute(
 *   'Admin João',
 *   'admin@example.com',
 *   'password123',
 *   UserIcon.ICON_1,
 *   '1990-01-15',
 *   ['comments-administrator', 'users-administrator']
 * );
 * // Cria administrador com roles específicas e envia email de verificação
 *
 * @throws {ConflictException} Se email já estiver registado
 */
@Injectable()
export class RegisterAdminUseCase {
  /**
   * Construtor do RegisterAdminUseCase
   *
   * @param {UserService} userService - Serviço para operações de utilizador
   * @param {UserCredentialService} userCredentialService - Serviço para credenciais
   * @param {EmailVerificationService} emailVerificationService - Serviço para tokens de verificação
   * @param {RoleService} roleService - Serviço para gestão de roles
   * @param {EmailService} emailService - Serviço para envio de endereços eletrónicos
   * @param {ConfigService} configService - Serviço para ler configurações (FRONTEND_URL)
   */
  constructor(
    private readonly userService: UserService,
    private readonly userCredentialService: UserCredentialService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly roleService: RoleService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Executar caso de uso de registo de administrador
   *
   * @async
   * @param {string} name - Nome de utilizador (display name)
   * @param {string} email - Email único
   * @param {string} password - Password em texto plano (será hasheada)
   * @param {UserIcon | undefined} icon - Ícone/avatar (opcional)
   * @param {string} birthDate - Data de nascimento (ISO format)
   * @param {RoleApiName[]} roles - Lista de roles administrativas a atribuir
   * @returns {Promise<void>}
   * @throws {ConflictException} Se email já estiver registado
   *
   * @description
   * 1. Verifica se email já existe
   * 2. Cria utilizador com nome, ícone e data de nascimento
   * 3. Atribui roles administrativas especificadas ao utilizador
   * 4. Cria credenciais com email e password hasheada
   * 5. Gera token de verificação de email
   * 6. Envia email de verificação com link
   */
  async execute(
    name: string,
    email: string,
    password: string,
    icon: UserIcon | undefined,
    birthDate: string,
    roles: RoleApiName[],
  ): Promise<void> {
    if (await this.userService.verityUserExistsByEmail(email)) {
      throw new ConflictException(AUTH_EXCEPTIONS.EMAIL_ALREADY_IN_USE);
    }

    const user = await this.userService.createUser(name, icon, birthDate);

    await this.roleService.assignRolesToUser(user, roles);

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
