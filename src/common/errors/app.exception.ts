import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCodes } from './error-codes';

export type AppExceptionBody = {
  errorCode: ErrorCodes;
  message?: string;
};

export class AppException extends HttpException {
  readonly errorCode: ErrorCodes;

  constructor(errorCode: ErrorCodes, status: HttpStatus, message?: string) {
    const body: AppExceptionBody = { errorCode, ...(message && { message }) };
    super(body, status);
    this.errorCode = errorCode;
  }
}
