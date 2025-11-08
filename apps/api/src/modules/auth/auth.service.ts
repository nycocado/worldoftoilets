import { Injectable } from '@nestjs/common';
import { LoginResponseDto, RefreshTokenResponseDto } from '@modules/auth/dto';
import { UserIcon } from '@database/entities';
import { LoginUseCase } from '@modules/auth/use-cases';
import { RegisterUseCase } from '@modules/auth/use-cases';
import { RefreshTokenUseCase } from '@modules/auth/use-cases';
import { VerifyEmailUseCase } from '@modules/auth/use-cases';
import { ResendVerificationUseCase } from '@modules/auth/use-cases';
import { ForgotPasswordUseCase } from '@modules/auth/use-cases';
import { ResetPasswordUseCase } from '@modules/auth/use-cases';
import { LogoutUseCase } from '@modules/auth/use-cases';
import { LogoutAllUseCase } from '@modules/auth/use-cases';

/**
 * Serviço de Autenticação
 *
 * @class AuthService
 * @description Serviço principal que orquestra todos os casos de uso de autenticação.
 * Funciona como uma fachada que delega a lógica para use-cases específicos,
 * mantendo a separação de responsabilidades e testabilidade.
 *
 * @example
 * // Login de utilizador
 * const response = await authService.login('user@example.com', 'password');
 *
 * @example
 * // Registo de nova conta
 * await authService.register(
 *   'João Silva',
 *   'joao@example.com',
 *   'password123',
 *   UserIcon.ICON_1,
 *   '1990-01-15'
 * );
 *
 * @see LoginUseCase - Caso de uso para autenticação
 * @see RegisterUseCase - Caso de uso para registo
 * @see RefreshTokenUseCase - Caso de uso para renovação de token
 */
@Injectable()
export class AuthService {
  /**
   * Construtor do AuthService
   *
   * @param {LoginUseCase} loginUseCase - Caso de uso para login
   * @param {RegisterUseCase} registerUseCase - Caso de uso para registo
   * @param {RefreshTokenUseCase} refreshTokenUseCase - Caso de uso para renovação de token
   * @param {VerifyEmailUseCase} verifyEmailUseCase - Caso de uso para verificação de email
   * @param {ResendVerificationUseCase} resendVerificationUseCase - Caso de uso para reenvio de verificação
   * @param {ForgotPasswordUseCase} forgotPasswordUseCase - Caso de uso para recuperação de password
   * @param {ResetPasswordUseCase} resetPasswordUseCase - Caso de uso para reset de password
   * @param {LogoutUseCase} logoutUseCase - Caso de uso para logout simples
   * @param {LogoutAllUseCase} logoutAllUseCase - Caso de uso para logout de todas as sessões
   */
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly resendVerificationUseCase: ResendVerificationUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly logoutAllUseCase: LogoutAllUseCase,
  ) {}

  /**
   * Autenticar utilizador com email e password
   *
   * @async
   * @param {string} email - Email do utilizador
   * @param {string} password - Password do utilizador em texto plano
   * @returns {Promise<LoginResponseDto>} Objeto com tokens de acesso e refresh
   * @throws {BadRequestException} Se credenciais forem inválidas
   * @throws {UnauthorizedException} Se email não estiver verificado
   *
   * @description
   * Valida as credenciais do utilizador, verifica se o email está verificado,
   * e retorna tokens JWT para a sessão. Tokens são configuráveis via .env
   */
  async login(email: string, password: string): Promise<LoginResponseDto> {
    return this.loginUseCase.execute(email, password);
  }

  /**
   * Registar nova conta de utilizador
   *
   * @async
   * @param {string} name - Nome de utilizador (display name/alcunha)
   * @param {string} email - Email do utilizador
   * @param {string} password - Password em texto plano (será hasheado)
   * @param {UserIcon | undefined} icon - Ícone/avatar selecionado pelo utilizador
   * @param {string} birthDate - Data de nascimento em formato ISO (YYYY-MM-DD)
   * @returns {Promise<void>}
   * @throws {BadRequestException} Se email já estiver registado ou dados inválidos
   *
   * @description
   * Cria conta, envia email de verificação, e marca como não verificado.
   * Password é hasheado com bcrypt antes de armazenar.
   */
  async register(
    name: string,
    email: string,
    password: string,
    icon: UserIcon | undefined,
    birthDate: string,
  ): Promise<void> {
    return this.registerUseCase.execute(name, email, password, icon, birthDate);
  }

  /**
   * Revogar token de refresh (logout de sessão específica)
   *
   * @async
   * @param {string} token - Token de refresh a revogar
   * @returns {Promise<void>}
   * @throws {UnauthorizedException} Se token for inválido ou expirado
   *
   * @description
   * Marca o refresh token como inválido, efetivamente fazendo logout
   * de uma sessão específica. Outros tokens do utilizador permanecem válidos.
   */
  async revokeRefreshToken(token: string): Promise<void> {
    return this.logoutUseCase.execute(token);
  }

  /**
   * Revogar todos os tokens de refresh do utilizador (logout global)
   *
   * @async
   * @param {string} token - Token de refresh para identificar o utilizador
   * @returns {Promise<void>}
   * @throws {UnauthorizedException} Se token for inválido ou expirado
   *
   * @description
   * Marca todos os refresh tokens do utilizador como inválidos,
   * efetivamente fazendo logout de todas as sessões abertas.
   */
  async revokeAllRefreshTokens(token: string): Promise<void> {
    return this.logoutAllUseCase.execute(token);
  }

  /**
   * Renovar token de acesso usando token de refresh
   *
   * @async
   * @param {string} token - Refresh token válido
   * @returns {Promise<RefreshTokenResponseDto>} Novo access token e refresh token
   * @throws {UnauthorizedException} Se token for inválido, expirado ou revogado
   *
   * @description
   * Valida o refresh token, verifica se os papéis do utilizador foram
   * modificados, e gera novo access token mantendo o refresh token.
   */
  async refreshAccessToken(token: string): Promise<RefreshTokenResponseDto> {
    return this.refreshTokenUseCase.execute(token);
  }

  /**
   * Verificar email com token de verificação
   *
   * @async
   * @param {string} token - Token de verificação enviado por email
   * @returns {Promise<void>}
   * @throws {BadRequestException} Se token for inválido ou expirado
   *
   * @description
   * Marca o email como verificado quando o utilizador clica no link
   * do email recebido. Apenas necessário para completar o registo.
   */
  async verifyEmail(token: string): Promise<void> {
    return this.verifyEmailUseCase.execute(token);
  }

  /**
   * Reenviar email de verificação para um utilizador
   *
   * @async
   * @param {string} email - Email do utilizador
   * @returns {Promise<void>}
   * @throws {BadRequestException} Se email não existir ou já estiver verificado
   *
   * @description
   * Gera novo token de verificação e envia email de verificação.
   * Útil quando utilizador não recebeu o email original.
   */
  async resendVerificationEmail(email: string): Promise<void> {
    return this.resendVerificationUseCase.execute(email);
  }

  /**
   * Solicitar reset de password
   *
   * @async
   * @param {string} email - Email do utilizador
   * @returns {Promise<void>}
   * @throws Não lança exceção para segurança (não revela se email existe)
   *
   * @description
   * Gera token de reset de password e envia email com link.
   * Por segurança, retorna sucesso mesmo se email não existir.
   */
  async forgotPassword(email: string): Promise<void> {
    return this.forgotPasswordUseCase.execute(email);
  }

  /**
   * Efetuar reset de password com token
   *
   * @async
   * @param {string} token - Token de reset obtido no email
   * @param {string} newPassword - Nova password em texto plano (será hasheada)
   * @returns {Promise<void>}
   * @throws {BadRequestException} Se token for inválido, expirado ou password fraca
   *
   * @description
   * Valida o token de reset, verifica force da nova password,
   * e substitui a password antiga pelo novo valor hasheado.
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    return this.resetPasswordUseCase.execute(token, newPassword);
  }
}
