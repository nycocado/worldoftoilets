import { BadRequestException, Injectable } from '@nestjs/common';
import { PasswordResetEntity } from '@database/entities';
import { PASSWORD_RESET_EXCEPTIONS } from '@modules/password-reset/constants';
import { PasswordResetRepository } from '@modules/password-reset/password-reset.repository';

@Injectable()
export class VerifyTokenUseCase {
  constructor(
    private readonly passwordResetRepository: PasswordResetRepository,
  ) {}

  async execute(token: string): Promise<PasswordResetEntity> {
    const reset = await this.passwordResetRepository.findByToken(token);

    if (!reset) {
      throw new BadRequestException(
        PASSWORD_RESET_EXCEPTIONS.RECOVERY_TOKEN_INVALID,
      );
    }

    if (reset.isExpired) {
      throw new BadRequestException(
        PASSWORD_RESET_EXCEPTIONS.RECOVERY_TOKEN_EXPIRED,
      );
    }

    await this.passwordResetRepository.invalidate(reset);

    return reset;
  }
}
