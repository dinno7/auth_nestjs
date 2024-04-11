import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const receiveUserEmailSchema = z.object({
  email: z.string({ required_error: 'is required' }).email('is invalid'),
});

export class ReceiveUserEmailDto extends createZodDto(receiveUserEmailSchema) {}
