import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayload, RequestUser } from '@common/types/jwt.types';
import { UserService } from '@modules/user/user.service';
import { AUTH_EXCEPTIONS } from './constants/exceptions.constant';

/**
 * Estratégia Passport para validação de JWT extraído de cookies ou Authorization header.
 */
@Injectable()
export class JwtCookieStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
  ) {
    const jwtSecret = configService.getOrThrow<string>('JWT_SECRET');

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.['token'],
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: jwtSecret,
    });
  }

  /**
   * Valida o payload do JWT e retorna um objeto de utilizador para a requisição.
   *
   * @param {JwtPayload} payload Payload decodificado do token JWT.
   * @returns {Promise<RequestUser>} Objeto com informações do utilizador autenticado.
   * @throws {UnauthorizedException} Se o utilizador foi desativado.
   */
  async validate(payload: JwtPayload): Promise<RequestUser> {
    const user = await this.userService.getUserByPublicId(payload.publicId);

    if (user.deactivatedAt) {
      throw new UnauthorizedException(AUTH_EXCEPTIONS.USER_DEACTIVATED);
    }

    return {
      publicId: payload.publicId,
      roles: payload.roles,
    };
  }
}
