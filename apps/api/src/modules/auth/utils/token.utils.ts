import { JwtService } from '@nestjs/jwt';
import { RoleApiName } from '@database/entities';

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
