import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseDto } from './common/response.dto';
import { TransformInterceptor } from './common/transform.interceptor';

@UseInterceptors(TransformInterceptor)
@Controller({
  version: '1',
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): ResponseDto {
    return this.appService.getHello();
  }
}
