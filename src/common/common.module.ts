import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SerializeResponseInterceptor } from './interceptors/serialize-response.interceptor';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: SerializeResponseInterceptor,
    },
  ],
})
export class CommonModule {}
