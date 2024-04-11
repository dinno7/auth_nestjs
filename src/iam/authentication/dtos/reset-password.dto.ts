import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const resetPasswordSchema = z
  .object({
    token: z.string({ required_error: 'is required' }),
    password: z
      .password({ required_error: 'is required' })
      .atLeastOne('digit', 'need at least one digit'),
    confirmPassword: z
      .password({ required_error: 'is required' })
      .atLeastOne('digit', 'need at least one digit'),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'is not match',
    path: ['password', 'confirmPassword'],
  });

export class ResetPasswordDto extends createZodDto(resetPasswordSchema) {}
