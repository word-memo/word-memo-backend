/**
 * Numeric API error codes for FE i18n.
 * Format: XXYYY — XX = domain group, YYY = specific error.
 *
 * Groups:
 *  10xxx — common / system
 *  11xxx — auth
 *  12xxx — users
 *
 * Throw only via AppException from services/handlers.
 */
export enum ErrorCodes {
  // 10xxx — common
  INTERNAL = 10000,
  HEALTH_DB_UNAVAILABLE = 10001,

  // 11xxx — auth
  AUTH_INVALID_CREDENTIALS = 11001,
  AUTH_USER_ALREADY_EXISTS = 11002,
  AUTH_INVALID_TOKEN = 11003,
  AUTH_INVALID_TOKEN_TYPE = 11004,
  AUTH_INVALID_TOKEN_PAYLOAD = 11005,
  AUTH_INVALID_ACCESS_TOKEN = 11006,

  // 12xxx — users
  USER_NOT_FOUND = 12001,
  USER_PASSWORD_REQUIRED = 12002,
  USER_PASSWORD_NOT_ALLOWED = 12003,
}
