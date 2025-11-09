import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@modules/user';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '@modules/refresh-token/refresh-token.service';
import { LoginResponseDto } from '@modules/auth/dto';
import { AUTH_EXCEPTIONS } from '@modules/auth/constants';
import { createAccessToken } from '@modules/auth/utils/token.utils';
import * as bcrypt from 'bcrypt';
import { Transactional } from '@mikro-orm/mariadb';

/**
 * Caso de Uso para Login
 *
 * @class LoginUseCase
 * @description Implementa a lógica de autenticação de utilizador.
 * Valida email, password e estado de verificação de email.
 * Gera access token e refresh token para a sessão.
 *
 * @implements
 *   - Validação de existência de utilizador
 *   - Comparação de password com hash bcrypt
 *   - Verificação de email verificado
 *   - Geração de tokens JWT
 *   - Criação de refresh token no banco de dados
 *
 * @example
 * const response = await loginUseCase.execute('user@example.com', 'password123');
 * // Retorna { accessToken, refreshToken, user: { publicId, name, email, icon } }
 *
 * @throws {UnauthorizedException} Se credenciais inválidas ou email não verificado
 */
@Injectable()
export class LoginUseCase {
  /**
   * Construtor do LoginUseCase
   *
   * @param {UserService} userService - Serviço para operações de utilizador
   * @param {JwtService} jwtService - Serviço NestJS para geração de JWT
   * @param {RefreshTokenService} refreshTokenService - Serviço para refresh tokens
   */
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  /**
   * Executar caso de uso de login
   *
   * @async
   * @param {string} email - Email do utilizador
   * @param {string} password - Password em texto plano
   * @returns {Promise<LoginResponseDto>} Tokens e dados do utilizador
   * @throws {UnauthorizedException} Se email/password inválidos ou email não verificado
   *
   * @description
   * 1. Busca utilizador por email
   * 2. Valida password com bcrypt
   * 3. Verifica se email foi verificado
   * 4. Gera access token JWT
   * 5. Cria refresh token no banco de dados
   * 6. Retorna resposta com tokens e dados públicos do utilizador
   */
  @Transactional()
  async execute(email: string, password: string): Promise<LoginResponseDto> {
    const user = await this.userService.getUserByEmail(email);

    if (!user || !user.credential) {
      throw new UnauthorizedException(AUTH_EXCEPTIONS.INVALID_CREDENTIALS);
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
      user.id,
      user.publicId,
      user.roles.map((role) => role.apiName),
    );

    const refreshToken =
      await this.refreshTokenService.createRefreshToken(user);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken.token,
      user: {
        publicId: user.publicId,
        name: user.name,
        email: user.credential.email,
        icon: user.icon,
      },
    };
  }
}
