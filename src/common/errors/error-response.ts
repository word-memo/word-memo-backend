import { ErrorCodes } from './error-codes';

export type ErrorResponse = {
  statusCode: number;
  timestamp: string;
  path: string;
  errorCode?: ErrorCodes;
  message?: string | string[];
};
