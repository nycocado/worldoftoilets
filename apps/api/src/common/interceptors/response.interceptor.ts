import { ApiResponseDto } from '@common/dto/api-response.dto';
import { map, Observable } from 'rxjs';
import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse();
    const statusCode = res?.statusCode ?? HttpStatus.OK;

    return next.handle().pipe(
      map((data) => {
        if (data && data.statusCode && data.message) return data;
        return new ApiResponseDto(
          (data && data.message) || 'OK',
          data && data.message ? undefined : data,
          statusCode,
        );
      }),
    );
  }
}
