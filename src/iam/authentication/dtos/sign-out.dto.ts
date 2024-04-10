import { createZodDto } from 'nestjs-zod';
import { refreshTokenSchema } from './refresh-token.dto';

export class SignOutDto extends createZodDto(refreshTokenSchema) {}
