import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayload, RequestUser } from '@common/types/jwt.types';

/**
 * Estratégia JWT via Cookies
 *
 * @class JwtCookieStrategy
 * @extends PassportStrategy
 * @description Estratégia Passport para validação de JWT extraído de cookies ou Authorization header.
 * Integra-se com Passport.js para proteger endpoints e extrair informações do utilizador.
 *
 * @strategy jwt
 * @extractors
 *   1. Cookies (campo 'token') - Prioridade 1
 *   2. Authorization Header Bearer - Prioridade 2 (fallback)
 *
 * @see RequestUser - Tipo de dados do utilizador autenticado
 * @see JwtPayload - Payload do token JWT
 */
@Injectable()
export class JwtCookieStrategy extends PassportStrategy(Strategy, 'jwt') {
  /**
   * Construtor da estratégia JWT
   *
   * @param {ConfigService} configService - Serviço de configuração para obter JWT_SECRET
   *
   * @description
   * Configura Passport para:
   * 1. Extrair JWT de cookies ou Authorization header
   * 2. Validar assinatura com segredo JWT
   * 3. Chamar validate() para processar payload
   */
  constructor(configService: ConfigService) {
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
   * Validar payload do JWT
   *
   * @async
   * @param {JwtPayload} payload - Payload decodificado do token JWT
   * @param {number} payload.sub - ID interno do utilizador (subject)
   * @param {string} payload.publicId - ID público UUID do utilizador
   * @param {string[]} payload.roles - Array de papéis/roles do utilizador
   * @returns {Promise<RequestUser>} Objeto com informações do utilizador autenticado
   *
   * @description
   * Chamada automaticamente pelo Passport após validar assinatura do token.
   * Transforma payload JWT em objeto RequestUser para injeção em @User().
   * Realiza qualquer validação adicional ou obtenção de dados se necessário.
   *
   * @example
   * {
   *   sub: 123,
   *   publicId: "550e8400-e29b-41d4-a716-446655440000",
   *   roles: ["user", "moderator"],
   *   iat: 1699000000,
   *   exp: 1699900000
   * }
   */
  async validate(payload: JwtPayload): Promise<RequestUser> {
    return {
      id: payload.sub,
      publicId: payload.publicId,
      roles: payload.roles,
    };
  }
}
