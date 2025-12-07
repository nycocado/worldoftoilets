import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CsrfTokenResponseDto } from '@modules/auth/dto';

export const ApiSwaggerCsrfToken = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Get CSRF Token',
      description:
        'Obtém um token CSRF para proteção contra ataques CSRF. O servidor define cookies httpOnly e retorna o token no response body.',
    }),
    ApiOkResponse({
      description: 'Token CSRF gerado com sucesso.',
      type: CsrfTokenResponseDto,
      headers: {
        'Set-Cookie': {
          description: 'Cookies contendo o session ID do CSRF e o token CSRF.',
          schema: {
            type: 'string',
            example: 'csrf_session_id=string; x-csrf-token=string;',
          },
        },
      },
    }),
  );
