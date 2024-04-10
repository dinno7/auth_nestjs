import { SetMetadata } from '@nestjs/common';
import { ZodDto } from 'nestjs-zod';
import { ZodSchema } from 'zod';

export const SET_SERIALIZE_DTO_DECORATOR_KEY = 'serialize';

export const Serialize = (dtoOrSchema: ZodDto | ZodSchema) =>
  SetMetadata(SET_SERIALIZE_DTO_DECORATOR_KEY, dtoOrSchema);
