import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@modules/user';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '@modules/refresh-token/refresh-token.service';
import { AUTH_EXCEPTIONS } from '@modules/auth/constants';
import { createAccessToken } from '@modules/auth/utils/token.utils';
import * as bcrypt from 'bcrypt';
import { Transactional } from '@mikro-orm/mariadb';
import { CommentService } from '@modules/comment';
import { plainToInstance } from 'class-transformer';
import { UserLoginResponseDto } from '@modules/user/dto';
import { LoginResponseDto } from '@modules/auth/dto';

/**
 * Implementa o caso de uso de autenticação de utilizador.
 */
@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly commentService: CommentService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  /**
   * Executa a lógica de autenticação de utilizador.
   *
   * @param {string} email O email do utilizador.
   * @param {string} password A password em texto plano.
   * @returns {Promise<LoginResponseDto>} Tokens e dados do utilizador.
   * @throws {UnauthorizedException} Se as credenciais forem inválidas, o email não estiver verificado ou o utilizador foi desativado.
   */
  @Transactional()
  async execute(email: string, password: string): Promise<LoginResponseDto> {
    const user = await this.userService.getUserByEmail(email);

    if (!user || !user.credential) {
      throw new UnauthorizedException(AUTH_EXCEPTIONS.INVALID_CREDENTIALS);
    }

    if (user.deactivatedAt) {
      throw new UnauthorizedException(AUTH_EXCEPTIONS.USER_DEACTIVATED);
    }

    if (!user.credential.emailVerified) {
      throw new UnauthorizedException(AUTH_EXCEPTIONS.EMAIL_NOT_VERIFIED);
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.credential.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH_EXCEPTIONS.INVALID_CREDENTIALS);
    }

    const accessToken = await createAccessToken(
      this.jwtService,
      user.publicId,
      user.roles.map((role) => role.apiName),
    );

    const refreshToken =
      await this.refreshTokenService.createRefreshToken(user);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken.token,
      user: plainToInstance(UserLoginResponseDto, user, {
        excludeExtraneousValues: true,
      }),
    };
  }
}
