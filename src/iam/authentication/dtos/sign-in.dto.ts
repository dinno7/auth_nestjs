import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const signInSchema = z.object({
  email: z
    .string({ required_error: 'is required' })
    .email({ message: 'is invalid' }),
  password: z
    .password({ required_error: 'is required' })
    .atLeastOne('digit', 'need at least one digit'),
});

export class SignInDto extends createZodDto(signInSchema) {}
