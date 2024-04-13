import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  getCats() {
    return { name: 'Jerry' };
  }
}
