import type { Request } from 'express';
import {
  Body,
  Controller,
  Headers,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ForgotPasswordRequestDto,
  LoginRequestDto,
  LoginResponseDto,
  RefreshTokenResponseDto,
  RegisterRequestDto,
  ResendVerificationRequestDto,
  ResetPasswordRequestDto,
} from '@modules/auth/dto';
import { ConfigService } from '@nestjs/config';
import { textTimeToMilliseconds } from '@common/utils/jwt-time.util';
import { ApiResponseDto } from '@common/dto/api-response.dto';
import { AUTH_EXCEPTIONS, AUTH_MESSAGES } from '@modules/auth/constants';
import {
  ApiSwaggerForgotPassword,
  ApiSwaggerLogin,
  ApiSwaggerLogout,
  ApiSwaggerLogoutAll,
  ApiSwaggerRefresh,
  ApiSwaggerRegister,
  ApiSwaggerRegisterAdmin,
  ApiSwaggerResendVerification,
  ApiSwaggerResetPassword,
  ApiSwaggerVerifyEmail,
} from '@modules/auth/swagger';
import {
  ForgotPasswordUseCase,
  LoginUseCase,
  LogoutAllUseCase,
  LogoutUseCase,
  RefreshTokenUseCase,
  RegisterAdminUseCase,
  RegisterUseCase,
  ResendVerificationUseCase,
  ResetPasswordUseCase,
  VerifyEmailUseCase,
} from '@modules/auth/use-cases';
import { JwtAuthGuard, PermissionsGuard } from '@common/guards';
import { RequiresPermissions } from '@common/decorators';
import { PermissionApiName, RoleApiName } from '@database/entities';
import { RegisterAdminRequestDto } from '@modules/auth/dto/register-admin-request.dto';

/**
 * Controlador de Autenticação
 *
 * @class AuthController
 * @description Controlador que expõe endpoints HTTP para todas as operações de autenticação.
 * Processa requests, valida DTOs, configura cookies seguras, e delega lógica para os use cases.
 *
 * @route /auth - Rota base para todos os endpoints de autenticação
 *
 * @endpoints
 * - POST /auth/login - Autenticar utilizador
 * - POST /auth/register - Registar novo utilizador
 * - POST /auth/register/admin - Registar novo administrador (requer permissão CREATE_USERS)
 * - POST /auth/refresh - Renovar token de acesso
 * - POST /auth/logout - Logout de sessão específica
 * - POST /auth/logout-all - Logout de todas as sessões do utilizador
 * - POST /auth/verify-email - Verificar email
 * - POST /auth/resend-verification - Reenviar email de verificação
 * - POST /auth/forgot-password - Solicitar recuperação de password
 * - POST /auth/reset-password - Efetuar reset de password
 *
 * @see LoginUseCase, RegisterUseCase, RefreshTokenUseCase - Use cases que executam a lógica de negócio
 * @see ApiSwagger - Decoradores de documentação Swagger
 */
@Controller('auth')
export class AuthController {
  /**
   * Construtor do AuthController
   *
   * @param {ConfigService} configService - Serviço de configuração para ler variáveis de ambiente
   * @param {LoginUseCase} loginUseCase - Use case para autenticação de utilizador
   * @param {RegisterUseCase} registerUseCase - Use case para registo de utilizador
   * @param {RegisterAdminUseCase} registerAdminUseCase - Use case para registo de administrador
   * @param {RefreshTokenUseCase} refreshTokenUseCase - Use case para renovação de tokens
   * @param {VerifyEmailUseCase} verifyEmailUseCase - Use case para verificação de email
   * @param {ResendVerificationUseCase} resendVerificationUseCase - Use case para reenvio de verificação
   * @param {ForgotPasswordUseCase} forgotPasswordUseCase - Use case para recuperação de password
   * @param {ResetPasswordUseCase} resetPasswordUseCase - Use case para reset de password
   * @param {LogoutUseCase} logoutUseCase - Use case para logout de sessão específica
   * @param {LogoutAllUseCase} logoutAllUseCase - Use case para logout de todas as sessões
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly registerAdminUseCase: RegisterAdminUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly resendVerificationUseCase: ResendVerificationUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly logoutAllUseCase: LogoutAllUseCase,
  ) {}

  /**
   * Autenticar utilizador
   *
   * @async
   * @route POST /auth/login
   * @param {LoginRequestDto} loginDto - Email e password do utilizador
   * @param {Response} res - Objeto de resposta Express para configurar cookies
   * @returns {Promise<ApiResponseDto<LoginResponseDto>>} Tokens e dados da sessão
   * @throws {BadRequestException} Se credenciais forem inválidas
   * @throws {UnauthorizedException} Se email não estiver verificado
   *
   * @description
   * Valida credenciais, gera tokens JWT, e configura cookies HTTP-only seguras.
   * - Access token: curta vida (ex: 15m) para operações na API
   * - Refresh token: longa vida (ex: 30d) para renovar access token
   * Ambos os tokens são guardados em cookies seguras, HTTP-only e SameSite=Strict.
   */
  @ApiSwaggerLogin()
  @Post('login')
  async login(
    @Body() loginDto: LoginRequestDto,
    @Res({ passthrough: true }) res: any,
  ): Promise<ApiResponseDto<LoginResponseDto>> {
    const { email, password } = loginDto;
    const loginResponse = await this.loginUseCase.execute(email, password);

    const jwtExpiration =
      this.configService.getOrThrow<string>('JWT_EXPIRATION');
    const maxAge = textTimeToMilliseconds(jwtExpiration);

    res.cookie('token', loginResponse.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge,
    });

    const refreshExpiration = this.configService.getOrThrow<string>(
      'JWT_REFRESH_EXPIRATION',
    );
    const refreshMaxAge = textTimeToMilliseconds(refreshExpiration);

    res.cookie('refreshToken', loginResponse.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: refreshMaxAge,
    });

    return new ApiResponseDto<LoginResponseDto>(
      AUTH_MESSAGES.LOGIN_SUCCESS,
      loginResponse,
    );
  }

  /**
   * Registar novo utilizador
   *
   * @async
   * @route POST /auth/register
   * @param {RegisterRequestDto} registerDto - Dados de registo (nome, email, password, icon, data nascimento)
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso
   * @throws {BadRequestException} Se email já existir ou dados forem inválidos
   * @throws {ConflictException} Se email já estiver registado
   *
   * @description
   * Cria conta com password hasheada e envia email de verificação.
   * Utilizador não pode fazer login até verificar o email.
   * Ícone é opcional e default para ICON_DEFAULT.
   */
  @ApiSwaggerRegister()
  @Post('register')
  async register(
    @Body() registerDto: RegisterRequestDto,
  ): Promise<ApiResponseDto> {
    const { name, email, password, icon, birthDate } = registerDto;
    await this.registerUseCase.execute(name, email, password, icon, birthDate);
    return new ApiResponseDto(AUTH_MESSAGES.REGISTER_SUCCESS);
  }

  /**
   * Registar novo administrador
   *
   * @async
   * @route POST /auth/register/admin
   * @protected Requer autenticação JWT e permissão CREATE_USERS
   * @param {RegisterAdminRequestDto} registerDto - Dados de registo (user + roles administrativas)
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso
   * @throws {BadRequestException} Se email já existir ou dados forem inválidos
   * @throws {ConflictException} Se email já estiver registado
   * @throws {UnauthorizedException} Se token de autenticação for inválido ou ausente
   * @throws {ForbiddenException} Se utilizador não possuir permissão CREATE_USERS
   *
   * @description
   * Cria conta administrativa com roles específicas, password hasheada e envia email de verificação.
   * Diferente do registo normal, este endpoint permite atribuir roles administrativas personalizadas.
   * Apenas utilizadores com permissão CREATE_USERS podem criar administradores.
   * Utilizador não pode fazer login até verificar o email.
   */
  @ApiSwaggerRegisterAdmin()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.CREATE_USERS)
  @Post('register/admin')
  async registerAdmin(
    @Body() registerDto: RegisterAdminRequestDto,
  ): Promise<ApiResponseDto> {
    const { name, email, password, icon, birthDate } = registerDto.user;
    const roles = registerDto.roles;
    await this.registerAdminUseCase.execute(
      name,
      email,
      password,
      icon,
      birthDate,
      roles as unknown as RoleApiName[],
    );
    return new ApiResponseDto(AUTH_MESSAGES.REGISTER_ADMIN_SUCCESS);
  }

  /**
   * Renovar token de acesso
   *
   * @async
   * @route POST /auth/refresh
   * @param {Request} req - Request Express (para extrair refreshToken do cookie)
   * @param {Response} res - Response Express para configurar novo cookie de access token
   * @param {string} authorization - Bearer token do header Authorization
   * @returns {Promise<ApiResponseDto<RefreshTokenResponseDto>>} Novo access token
   * @throws {UnauthorizedException} Se refresh token for inválido, expirado ou revogado
   *
   * @description
   * Valida refresh token existente, verifica papéis do utilizador,
   * e gera novo access token. Refresh token é renovado se próximo de expirar.
   * Ambos os tokens são configurados em cookies seguras.
   */
  @ApiSwaggerRefresh()
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: any,
    @Headers('authorization') authorization?: string,
  ): Promise<ApiResponseDto<RefreshTokenResponseDto>> {
    const token = authorization?.replace('Bearer ', '');
    const refreshResponse = await this.refreshTokenUseCase.execute(
      token || req.cookies?.['refreshToken'],
    );

    const jwtExpiration =
      this.configService.getOrThrow<string>('JWT_EXPIRATION');
    const maxAge = textTimeToMilliseconds(jwtExpiration);

    res.cookie('token', refreshResponse.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge,
    });

    const refreshExpiration = this.configService.get<string>(
      'JWT_REFRESH_EXPIRATION',
      '30d',
    );
    const refreshMaxAge = textTimeToMilliseconds(refreshExpiration);

    res.cookie('refreshToken', refreshResponse.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: refreshMaxAge,
    });

    return new ApiResponseDto<RefreshTokenResponseDto>(
      AUTH_MESSAGES.REFRESH_SUCCESS,
      refreshResponse,
    );
  }

  /**
   * Logout de sessão específica
   *
   * @async
   * @route POST /auth/logout
   * @param {Request} req - Request Express (para extrair refreshToken do cookie)
   * @param {Response} res - Response Express para limpar cookies
   * @param {string} authorization - Bearer token do header Authorization
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso
   * @throws {UnauthorizedException} Se refresh token não for fornecido
   *
   * @description
   * Marca refresh token como inválido, efetuando logout de uma sessão.
   * Outras sessões do utilizador permanecem ativas.
   * Limpa cookies de token e refreshToken no cliente.
   */
  @ApiSwaggerLogout()
  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: any,
    @Headers('authorization') authorization?: string,
  ): Promise<ApiResponseDto> {
    const token = authorization?.replace('Bearer ', '');
    const refreshToken = token || req.cookies?.['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException(AUTH_EXCEPTIONS.REFRESH_TOKEN_REQUIRED);
    }

    await this.logoutUseCase.execute(refreshToken);

    res.clearCookie('token');
    res.clearCookie('refreshToken');

    return new ApiResponseDto(AUTH_MESSAGES.LOGOUT_SUCCESS);
  }

  /**
   * Logout de todas as sessões do utilizador
   *
   * @async
   * @route POST /auth/logout-all
   * @param {Request} req - Request Express (para extrair refreshToken do cookie)
   * @param {Response} res - Response Express para limpar cookies
   * @param {string} authorization - Bearer token do header Authorization
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso
   * @throws {UnauthorizedException} Se refresh token não for fornecido
   *
   * @description
   * Marca TODOS os refresh tokens do utilizador como inválidos.
   * Efetua logout global - todas as sessões abertas são terminadas.
   * Limpa cookies de token e refreshToken no cliente.
   */
  @ApiSwaggerLogoutAll()
  @Post('logout-all')
  async logoutAll(
    @Req() req: Request,
    @Res({ passthrough: true }) res: any,
    @Headers('authorization') authorization?: string,
  ): Promise<ApiResponseDto> {
    const token = authorization?.replace('Bearer ', '');
    const refreshToken = token || req.cookies?.['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException(AUTH_EXCEPTIONS.REFRESH_TOKEN_REQUIRED);
    }

    await this.logoutAllUseCase.execute(refreshToken);

    res.clearCookie('token');
    res.clearCookie('refreshToken');

    return new ApiResponseDto(AUTH_MESSAGES.LOGOUT_ALL_SUCCESS);
  }

  /**
   * Verificar email
   *
   * @async
   * @route POST /auth/verify-email
   * @param {string} authorization - Bearer token do header Authorization
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso
   * @throws {BadRequestException} Se token for inválido ou expirado
   * @throws {UnauthorizedException} Se token não for fornecido
   *
   * @description
   * Marca email como verificado quando utilizador clica link do email de verificação.
   * Necessário para completar o registo e poder fazer login.
   * Token é gerado durante o registo e enviado por email.
   */
  @ApiSwaggerVerifyEmail()
  @Post('verify-email')
  async verifyEmail(
    @Headers('authorization') authorization?: string,
  ): Promise<ApiResponseDto> {
    if (!authorization) {
      throw new UnauthorizedException(AUTH_EXCEPTIONS.TOKEN_REQUIRED);
    }
    const token = authorization.replace('Bearer ', '');
    await this.verifyEmailUseCase.execute(token);
    return new ApiResponseDto(AUTH_MESSAGES.VERIFY_EMAIL_SUCCESS);
  }

  /**
   * Reenviar email de verificação
   *
   * @async
   * @route POST /auth/resend-verification
   * @param {ResendVerificationRequestDto} resendVerificationDto - Email do utilizador (query param)
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso
   * @throws {BadRequestException} Se email não existir ou já estiver verificado
   *
   * @description
   * Gera novo token de verificação e envia email.
   * Útil quando utilizador não recebeu email original ou token expirou.
   * Apenas funciona para emails não verificados.
   */
  @ApiSwaggerResendVerification()
  @Post('resend-verification')
  async resendVerification(
    @Query() resendVerificationDto: ResendVerificationRequestDto,
  ): Promise<ApiResponseDto> {
    await this.resendVerificationUseCase.execute(resendVerificationDto.email);
    return new ApiResponseDto(AUTH_MESSAGES.RESEND_VERIFICATION_SUCCESS);
  }

  /**
   * Solicitar recuperação de password
   *
   * @async
   * @route POST /auth/forgot-password
   * @param {ForgotPasswordRequestDto} forgotPasswordDto - Email do utilizador (query param)
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso (mesmo se email não existe, por segurança)
   *
   * @description
   * Gera token de reset de password e envia email com link de recuperação.
   * Por segurança, retorna mensagem de sucesso mesmo se email não existir,
   * para evitar revelação de emails registados.
   */
  @ApiSwaggerForgotPassword()
  @Post('forgot-password')
  async forgotPassword(
    @Query() forgotPasswordDto: ForgotPasswordRequestDto,
  ): Promise<ApiResponseDto> {
    await this.forgotPasswordUseCase.execute(forgotPasswordDto.email);
    return new ApiResponseDto(AUTH_MESSAGES.FORGOT_PASSWORD_SUCCESS);
  }

  /**
   * Efetuar reset de password
   *
   * @async
   * @route POST /auth/reset-password
   * @param {ResetPasswordRequestDto} resetPasswordDto - Token e nova password (body)
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso
   * @throws {BadRequestException} Se token for inválido, expirado ou password for fraca
   *
   * @description
   * Valida token de reset, verifica requisitos da nova password,
   * substitui password antiga, e permite novo login.
   * Token é obtido no link do email enviado por forgot-password.
   */
  @ApiSwaggerResetPassword()
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordRequestDto,
  ): Promise<ApiResponseDto> {
    await this.resetPasswordUseCase.execute(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
    return new ApiResponseDto(AUTH_MESSAGES.RESET_PASSWORD_SUCCESS);
  }
}
