import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserService } from '@modules/user';
import { RequestUser } from '@common/types/jwt.types';

export const FullUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const jwtUser: RequestUser = request.user;

    const userService = ctx.switchToHttp().getRequest().app.get(UserService);

    return await userService.getById(jwtUser.id);
  },
);
