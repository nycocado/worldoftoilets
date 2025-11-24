import { Injectable, ConflictException } from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { UserService } from '@modules/user';
import { UserCredentialService } from '@modules/user-credential/user-credential.service';
import { EmailVerificationService } from '@modules/email-verification/email-verification.service';
import { EmailService } from '@modules/email/email.service';
import { ConfigService } from '@nestjs/config';
import { UserIcon } from '@database/entities';
import { AUTH_EXCEPTIONS } from '@modules/auth/constants';
import { RoleService } from '@modules/role';

/**
 * Implementa o caso de uso de registo de uma nova conta de utilizador.
 */
@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly userCredentialService: UserCredentialService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly roleService: RoleService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Executa a lógica de registo de uma nova conta de utilizador.
   *
   * @param {string} name O nome de utilizador.
   * @param {string} email O email único do utilizador.
   * @param {string} password A password em texto plano.
   * @param {UserIcon | undefined} icon O ícone/avatar do utilizador (opcional).
   * @param {string} birthDate A data de nascimento (formato ISO).
   * @returns {Promise<void>}
   * @throws {ConflictException} Se o email já estiver registado.
   */
  @Transactional()
  async execute(
    name: string,
    email: string,
    password: string,
    icon: UserIcon | undefined,
    birthDate: string,
  ): Promise<void> {
    if (await this.userService.verifyUserExistsByEmail(email)) {
      throw new ConflictException(AUTH_EXCEPTIONS.EMAIL_ALREADY_IN_USE);
    }

    const user = await this.userService.createUser(name, icon, birthDate);

    await this.roleService.assignDefaultRolesToUser(user);

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
