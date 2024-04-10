import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const refreshTokenSchema = z.object({
  refreshToken: z.string({ required_error: 'is required' }),
});

export class RefreshTokenDto extends createZodDto(refreshTokenSchema) {}
