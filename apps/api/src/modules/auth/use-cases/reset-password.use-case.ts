import { Injectable } from '@nestjs/common';
import { UserCredentialService } from '@modules/user-credential/user-credential.service';
import { PasswordResetService } from '@modules/password-reset/password-reset.service';
import { RefreshTokenService } from '@modules/refresh-token/refresh-token.service';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private readonly userCredentialService: UserCredentialService,
    private readonly passwordResetService: PasswordResetService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async execute(token: string, newPassword: string): Promise<void> {
    const reset = await this.passwordResetService.verifyToken(token);

    await this.userCredentialService.updatePassword(
      reset.userCredential,
      newPassword,
    );

    await this.passwordResetService.revokeAllResetTokens(reset.userCredential);
    await this.refreshTokenService.revokeAllUserRefreshTokens(
      reset.userCredential.user,
    );
  }
}
