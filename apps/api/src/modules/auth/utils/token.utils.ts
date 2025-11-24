import { JwtService } from '@nestjs/jwt';
import { RoleApiName } from '@database/entities';

/**
 * Gera um token JWT de acesso com payload contendo informações do utilizador.
 *
 * @param {JwtService} jwtService Serviço NestJS para geração de JWT.
 * @param {string} publicId O ID público UUID do utilizador.
 * @param {RoleApiName[]} roles Array com nomes de papéis/roles.
 * @returns {Promise<string>} O token JWT assinado.
 */
export async function createAccessToken(
  jwtService: JwtService,
  publicId: string,
  roles: RoleApiName[],
): Promise<string> {
  const payload = {
    publicId: publicId,
    roles: roles,
  };

  return jwtService.sign(payload);
}
