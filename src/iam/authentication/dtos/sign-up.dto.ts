import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const signUpSchema = z.object({
  name: z.string({
    required_error: 'is required',
  }),
  email: z
    .string({ required_error: 'is required' })
    .email({ message: 'is invalid' }),
  password: z
    .password({ required_error: 'is required' })
    .atLeastOne('digit', 'need at least one digit'),
});

export class SignUpDto extends createZodDto(signUpSchema) {}
