import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';

@Catch(ZodValidationException)
export class ZodValidationExceptionFilter<T extends ZodValidationException>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    const res = <Response>host.switchToHttp().getResponse();
    const exceptionsResponse = exception.getResponse();
    const zodError = exception.getZodError().issues.map((issue) => ({
      ...issue,
      message: `${issue?.path?.join(' & ')}: ${issue?.message}`,
    }));

    exceptionsResponse['errors'] = zodError;
    exceptionsResponse['error'] = 'Validation failed';
    exceptionsResponse['message'] = zodError.reduce(
      (acc, curr, index) =>
        (acc += `${curr.message}${index === zodError.length - 1 ? '' : ', '}`),
      '',
    );

    return res.status(exception.getStatus()).json(exceptionsResponse);
  }
}
