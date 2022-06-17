import { Injectable } from '@nestjs/common';
import { commonMessage } from './common/messages';
import { ResponseDto } from './common/response.dto';

@Injectable()
export class AppService {
  getHello(): ResponseDto {
    return {message: commonMessage.get , data: 'server is up and running'};
  }
}
