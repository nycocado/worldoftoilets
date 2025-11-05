import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export const ApiSwaggerHealthCheck = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Health Check',
      description:
        'Verifica o status de saúde da aplicação, incluindo memória heap.',
    }),
    ApiOkResponse({
      description: 'Status de saúde da aplicação.',
      schema: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'ok',
            enum: ['ok', 'error', 'shutting_down'],
          },
          info: {
            type: 'object',
            properties: {
              memory_heap: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'up',
                  },
                },
              },
            },
          },
          error: {
            type: 'object',
          },
          details: {
            type: 'object',
            properties: {
              memory_heap: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'up',
                  },
                },
              },
            },
          },
        },
      },
    }),
  );
