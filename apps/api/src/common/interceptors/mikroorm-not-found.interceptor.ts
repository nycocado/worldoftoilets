import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { NotFoundError } from '@mikro-orm/core';

@Injectable()
export class MikroOrmNotFoundInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof NotFoundError) {
          const message = err.message || 'Resource not found';
          return throwError(() => new NotFoundException(message));
        }
        return throwError(() => err);
      }),
    );
  }
}
