import { JwtService } from '@nestjs/jwt';
import { RoleApiName } from '@database/entities';

/**
 * Função Utilitária para Criação de Access Token
 *
 * @function createAccessToken
 * @description Gera um token JWT de acesso com payload contendo informações do utilizador.
 * Token é assinado com segredo JWT e contém expiração configurável.
 *
 * @async
 * @param {JwtService} jwtService - Serviço NestJS para geração de JWT
 * @param {number} userId - ID interno do utilizador
 * @param {string} publicId - ID público UUID do utilizador
 * @param {RoleApiName[]} roles - Array com nomes de papéis/roles
 * @returns {Promise<string>} Token JWT assinado
 *
 * @example
 * const token = await createAccessToken(
 *   jwtService,
 *   123,
 *   '550e8400-e29b-41d4-a716-446655440000',
 *   ['user', 'moderator']
 * );
 */
export async function createAccessToken(
  jwtService: JwtService,
  userId: number,
  publicId: string,
  roles: RoleApiName[],
): Promise<string> {
  const payload = {
    sub: userId,
    publicId: publicId,
    roles: roles,
  };

  return jwtService.sign(payload);
}
