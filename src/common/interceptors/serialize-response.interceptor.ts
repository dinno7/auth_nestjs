import { Injectable, NestInterceptor, StreamableFile } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ZodValidationException, validate } from 'nestjs-zod';
import { map } from 'rxjs';
import { SET_SERIALIZE_DTO_DECORATOR_KEY } from '../decorator/serialize.decorator';

const ErrorHandle = (e) => new ZodValidationException(e);
@Injectable()
export class SerializeResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}
  intercept(context, next) {
    const routeSerializeSchema = this.getContextResponseSchema(context);

    return next.handle().pipe(
      map((data) => {
        const result = {
          ok: true,
          timestamp: new Date().getTime(),
          data,
        };
        if (typeof data !== 'object' || data instanceof StreamableFile)
          return result;

        if (routeSerializeSchema)
          result.data = Array.isArray(data)
            ? data.map((item) =>
                validate(item, routeSerializeSchema, ErrorHandle),
              )
            : validate(data, routeSerializeSchema, ErrorHandle);

        return result;
      }),
    );
  }
  getContextResponseSchema(context) {
    return this.reflector.getAllAndOverride(SET_SERIALIZE_DTO_DECORATOR_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
