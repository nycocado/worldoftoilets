import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, Transactional } from '@mikro-orm/mariadb';
import { PasswordResetEntity, UserCredentialEntity } from '@database/entities';

/**
 * Gerencia o acesso e a persistência de dados para a entidade PasswordReset.
 */
@Injectable()
export class PasswordResetRepository {
  constructor(
    @InjectRepository(PasswordResetEntity)
    private readonly repository: EntityRepository<PasswordResetEntity>,
  ) {}

  /**
   * Busca um token de redefinição de senha pelo seu valor.
   * @param {string} token O token a ser buscado.
   * @returns {Promise<PasswordResetEntity | null>} A entidade do token ou `null` se não for encontrado.
   */
  async findByToken(token: string): Promise<PasswordResetEntity | null> {
    return this.repository.findOne(
      { token: token },
      { populate: ['userCredential', 'userCredential.user'] },
    );
  }

  /**
   * Busca todos os tokens de redefinição de senha expirados.
   * @returns {Promise<PasswordResetEntity[]>} A lista de entidades de token expiradas.
   */
  async findExpired(): Promise<PasswordResetEntity[]> {
    return this.repository.find({
      expiresAt: { $lt: new Date() },
    });
  }

  /**
   * Cria um novo token de redefinição de senha.
   * @param {UserCredentialEntity} userCredential A credencial do utilizador.
   * @param {Date} expiresAt A data de expiração do token.
   * @returns {Promise<PasswordResetEntity>} A entidade do token criado.
   */
  @Transactional()
  async create(
    userCredential: UserCredentialEntity,
    expiresAt: Date,
  ): Promise<PasswordResetEntity> {
    const em = this.repository.getEntityManager();
    const passwordReset = new PasswordResetEntity();
    passwordReset.userCredential = userCredential;
    passwordReset.expiresAt = expiresAt;

    await em.persistAndFlush(passwordReset);
    return passwordReset;
  }

  /**
   * Invalida um token de redefinição de senha.
   * @param {PasswordResetEntity} passwordReset A entidade do token a ser invalidado.
   * @returns {Promise<PasswordResetEntity>} A entidade do token invalidado.
   */
  @Transactional()
  async invalidate(
    passwordReset: PasswordResetEntity,
  ): Promise<PasswordResetEntity> {
    const em = this.repository.getEntityManager();
    passwordReset.invalidAt = new Date();
    await em.persistAndFlush(passwordReset);
    return passwordReset;
  }

  /**
   * Invalida todos os tokens de redefinição de senha para uma credencial de utilizador.
   * @param {UserCredentialEntity} userCredential A credencial do utilizador.
   * @returns {Promise<PasswordResetEntity[]>} A lista de entidades de token invalidadas.
   */
  @Transactional()
  async invalidateAllByUserCredential(
    userCredential: UserCredentialEntity,
  ): Promise<PasswordResetEntity[]> {
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
   * Remove permanentemente os tokens de redefinição de senha expirados.
   */
  @Transactional()
  async deleteExpired(): Promise<void> {
    const em = this.repository.getEntityManager();
    const tokens = await this.findExpired();
    await em.removeAndFlush(tokens);
  }
}
