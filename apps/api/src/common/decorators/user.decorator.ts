import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUser } from '@common/types/jwt.types';

export const User = createParamDecorator(
  (property: keyof RequestUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: RequestUser = request.user;
    return property ? user[property] : user;
  },
);
