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
 * Gerencia as requisições HTTP para operações de autenticação.
 */
@Controller('auth')
export class AuthController {
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
   * Autentica um utilizador, gera tokens e os define em cookies seguros.
   *
   * @param {LoginRequestDto} loginDto DTO com email e password.
   * @param {any} res Objeto de resposta Express para configurar cookies.
   * @returns {Promise<ApiResponseDto<LoginResponseDto>>} Tokens e dados da sessão.
   * @throws {BadRequestException} Se as credenciais forem inválidas.
   * @throws {UnauthorizedException} Se o email não estiver verificado.
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
   * Regista um novo utilizador e envia um email de verificação.
   *
   * @param {RegisterRequestDto} registerDto DTO com os dados de registo.
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso.
   * @throws {ConflictException} Se o email já estiver registado.
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
   * Regista um novo utilizador com roles administrativas. Requer permissão de 'CREATE_USERS'.
   *
   * @param {RegisterAdminRequestDto} registerDto DTO com os dados de registo do utilizador e as suas roles.
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso.
   * @throws {ConflictException} Se o email já estiver registado.
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
   * Renova o token de acesso e o refresh token, definindo-os em cookies seguros.
   *
   * @param {Request} req Objeto de requisição Express para extrair o refresh token do cookie.
   * @param {any} res Objeto de resposta Express para configurar novos cookies.
   * @param {string} [authorization] Token Bearer do cabeçalho Authorization.
   * @returns {Promise<ApiResponseDto<RefreshTokenResponseDto>>} Novo access token e refresh token.
   * @throws {UnauthorizedException} Se o refresh token for inválido, expirado ou revogado.
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
   * Realiza o logout de uma sessão específica, invalidando o refresh token e limpando os cookies.
   *
   * @param {Request} req Objeto de requisição Express para extrair o refresh token do cookie.
   * @param {any} res Objeto de resposta Express para limpar os cookies.
   * @param {string} [authorization] Token Bearer do cabeçalho Authorization.
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso.
   * @throws {UnauthorizedException} Se o refresh token não for fornecido.
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
   * Realiza o logout de todas as sessões do utilizador, invalidando todos os refresh tokens e limpando os cookies.
   *
   * @param {Request} req Objeto de requisição Express para extrair o refresh token do cookie.
   * @param {any} res Objeto de resposta Express para limpar os cookies.
   * @param {string} [authorization] Token Bearer do cabeçalho Authorization.
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso.
   * @throws {UnauthorizedException} Se o refresh token não for fornecido.
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
   * Verifica o email do utilizador usando um token de verificação.
   *
   * @param {string} [authorization] Token Bearer do cabeçalho Authorization.
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso.
   * @throws {UnauthorizedException} Se o token não for fornecido.
   * @throws {BadRequestException} Se o token for inválido ou expirado.
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
   * Reenvia um email de verificação para o utilizador.
   *
   * @param {ResendVerificationRequestDto} resendVerificationDto DTO com o email do utilizador.
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso.
   * @throws {BadRequestException} Se o email não existir ou já estiver verificado.
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
   * Solicita a recuperação de password, enviando um email com um link de reset.
   *
   * @param {ForgotPasswordRequestDto} forgotPasswordDto DTO com o email do utilizador.
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso.
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
   * Efetua o reset da password do utilizador.
   *
   * @param {ResetPasswordRequestDto} resetPasswordDto DTO com o token de reset e a nova password.
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso.
   * @throws {BadRequestException} Se o token for inválido, expirado ou a password for fraca.
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
