import { AppException, AppExceptionBody } from '@/common/errors/app.exception';
import { ErrorCodes } from '@/common/errors/error-codes';
import { ErrorResponse } from '@/common/errors/error-response';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Record<string, unknown>>();
    const path = httpAdapter.getRequestUrl(request) as string;

    const { statusCode, errorCode, message } = this.resolveException(exception);

    // Log the server error
    this.logger.error(exception);

    const body: ErrorResponse = {
      statusCode,
      timestamp: new Date().toISOString(),
      path,
      ...(errorCode !== undefined && { errorCode }),
      ...(message !== undefined && { message }),
    };

    httpAdapter.reply(ctx.getResponse(), body, statusCode);
  }

  private resolveException(exception: unknown): {
    statusCode: number;
    errorCode?: ErrorCodes;
    message?: string | string[];
  } {
    if (exception instanceof AppException) {
      const response = exception.getResponse() as AppExceptionBody;
      return {
        statusCode: exception.getStatus(),
        errorCode: exception.errorCode,
        ...(response.message && { message: response.message }),
      };
    }

    if (exception instanceof HttpException) {
      return {
        statusCode: exception.getStatus(),
        message: this.extractHttpMessage(exception.getResponse()),
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      errorCode: ErrorCodes.INTERNAL,
    };
  }

  private extractHttpMessage(
    response: string | object,
  ): string | string[] | undefined {
    if (typeof response === 'string') {
      return response;
    }

    if (
      typeof response === 'object' &&
      response !== null &&
      'message' in response
    ) {
      return (response as { message: string | string[] }).message;
    }

    return undefined;
  }
}
