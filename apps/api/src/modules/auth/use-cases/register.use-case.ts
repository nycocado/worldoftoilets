import { Injectable, ConflictException } from '@nestjs/common';
import { UserService } from '@modules/user';
import { UserCredentialService } from '@modules/user-credential/user-credential.service';
import { EmailVerificationService } from '@modules/email-verification/email-verification.service';
import { EmailService } from '@modules/email/email.service';
import { ConfigService } from '@nestjs/config';
import { UserIcon } from '@database/entities';
import { AUTH_EXCEPTIONS } from '@modules/auth/constants';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly userCredentialService: UserCredentialService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

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
