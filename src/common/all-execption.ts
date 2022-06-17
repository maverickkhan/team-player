import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const TypeORMErrors = {
  EntityNotFound: 404,
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let status;
    let message;
    let stack;
    let error;
    if (exception instanceof HttpException) {
      const exceptionDetails: any = exception.getResponse().valueOf();
      if (exceptionDetails?.response?.statusCode) {
        status = exceptionDetails.response.statusCode
      } else {
        status = exception.getStatus();
      }
      if (exceptionDetails?.response?.message) {
        message = exceptionDetails.response.message;
      } else {
        message = exceptionDetails.message;
      }
      if (Array.isArray(message)) {
        message = message.length
          ? message[0]
          : HttpStatus.INTERNAL_SERVER_ERROR;
      }
      if (exceptionDetails?.response?.error) {
        error = exceptionDetails.response.error;
      } else {
        error = exceptionDetails.error;
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      const exceptionDetails: any = exception;
      message = exceptionDetails.message;
      stack = exceptionDetails.stack;
      error = 'Unhandled Rejection';

      const customErrorStatusCode =
        this.checkForCustomErrorCode(exceptionDetails);
      if (customErrorStatusCode) {
        status = customErrorStatusCode;
      }
    }

    response.status(status).json({
      status: false,
      statusCode: status,
      message,
      error,
    });
  }

  checkForCustomErrorCode(exception: any) {
    return TypeORMErrors[exception.name];
  }
}
