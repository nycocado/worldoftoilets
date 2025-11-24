import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, Transactional } from '@mikro-orm/mariadb';
import {
  EmailVerificationEntity,
  UserCredentialEntity,
} from '@database/entities';

/**
 * Gerencia o acesso e a persistência de dados para a entidade EmailVerificationEntity.
 */
@Injectable()
export class EmailVerificationRepository {
  constructor(
    @InjectRepository(EmailVerificationEntity)
    private readonly repository: EntityRepository<EmailVerificationEntity>,
  ) {}

  /**
   * Busca um token de verificação de email pelo seu valor.
   * @param {string} token O token a ser buscado.
   * @returns {Promise<EmailVerificationEntity | null>} A entidade do token ou `null` se não for encontrado.
   */
  async findByToken(token: string): Promise<EmailVerificationEntity | null> {
    return this.repository.findOne(
      { token: token },
      { populate: ['userCredential', 'userCredential.user'] },
    );
  }

  /**
   * Busca todos os tokens de verificação de email para uma credencial de utilizador.
   * @param {UserCredentialEntity} userCredential A credencial do utilizador.
   * @returns {Promise<EmailVerificationEntity[]>} A lista de entidades de token.
   */
  async findByUserCredential(
    userCredential: UserCredentialEntity,
  ): Promise<EmailVerificationEntity[]> {
    return this.repository.find({ userCredential: userCredential });
  }

  /**
   * Busca todos os tokens de verificação de email expirados.
   * @returns {Promise<EmailVerificationEntity[]>} A lista de entidades de token expiradas.
   */
  async findExpired(): Promise<EmailVerificationEntity[]> {
    return this.repository.find({
      expiresAt: { $lt: new Date() },
    });
  }

  /**
   * Cria e persiste um novo token de verificação de email.
   * @param {UserCredentialEntity} userCredential A credencial do utilizador.
   * @param {Date} expiresAt A data de expiração do token.
   * @returns {Promise<EmailVerificationEntity>} A entidade do token criado.
   */
  @Transactional()
  async create(
    userCredential: UserCredentialEntity,
    expiresAt: Date,
  ): Promise<EmailVerificationEntity> {
    const em = this.repository.getEntityManager();
    const emailVerification = new EmailVerificationEntity();
    emailVerification.userCredential = userCredential;
    emailVerification.expiresAt = expiresAt;

    await em.persistAndFlush(emailVerification);
    return emailVerification;
  }

  /**
   * Invalida um token de verificação de email.
   * @param {EmailVerificationEntity} emailVerification A entidade do token a ser invalidado.
   * @returns {Promise<EmailVerificationEntity>} A entidade do token invalidado.
   */
  @Transactional()
  async invalidate(
    emailVerification: EmailVerificationEntity,
  ): Promise<EmailVerificationEntity> {
    const em = this.repository.getEntityManager();
    emailVerification.invalidAt = new Date();
    await em.persistAndFlush(emailVerification);
    return emailVerification;
  }

  /**
   * Invalida todos os tokens de verificação de email para uma credencial de utilizador.
   * @param {UserCredentialEntity} userCredential A credencial do utilizador.
   * @returns {Promise<EmailVerificationEntity[]>} A lista de entidades de token invalidadas.
   */
  @Transactional()
  async invalidateAllByUserCredential(
    userCredential: UserCredentialEntity,
  ): Promise<EmailVerificationEntity[]> {
    const em = this.repository.getEntityManager();
    const tokens = await this.repository.find({
      userCredential: userCredential,
    });

    tokens.forEach((token) => {
      token.invalidAt = new Date();
    });

    await em.persistAndFlush(tokens);
    return tokens;
  }

  /**
   * Remove permanentemente os tokens de verificação de email expirados.
   */
  @Transactional()
  async deleteExpired(): Promise<void> {
    const em = this.repository.getEntityManager();
    const tokens = await this.repository.find({
      expiresAt: { $lt: new Date() },
    });
    await em.removeAndFlush(tokens);
  }

  /**
   * Marca o email de um utilizador como verificado e invalida o token.
   * @param {EmailVerificationEntity} emailVerification A entidade do token a ser verificado.
   * @returns {Promise<EmailVerificationEntity>} A entidade do token verificado.
   */
  @Transactional()
  async verifyEmail(
    emailVerification: EmailVerificationEntity,
  ): Promise<EmailVerificationEntity> {
    const em = this.repository.getEntityManager();
    emailVerification.userCredential.emailVerified = true;
    emailVerification.invalidAt = new Date();

    await em.persistAndFlush(emailVerification.userCredential);
    await em.persistAndFlush(emailVerification);
    return emailVerification;
  }
}
