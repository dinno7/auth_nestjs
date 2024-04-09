import { ForbiddenException, HttpExceptionOptions } from '@nestjs/common';

const isInstanceOfHttpExceptionOptions = (
  input: string | HttpExceptionOptions,
): input is HttpExceptionOptions =>
  typeof input === 'object' && 'description' in input && 'cause' in input;

export class InvalidRefreshTokenException extends ForbiddenException {
  constructor(
    objectOrError?: string | object | any,
    descriptionOrOptions: string | HttpExceptionOptions = 'InvalidRefreshToken',
  ) {
    if (isInstanceOfHttpExceptionOptions(descriptionOrOptions)) {
      descriptionOrOptions.description =
        descriptionOrOptions.description || 'InvalidRefreshToken';
    }

    super(objectOrError, descriptionOrOptions);
  }
}
