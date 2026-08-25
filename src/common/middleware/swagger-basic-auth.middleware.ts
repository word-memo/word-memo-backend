import { timingSafeEqual } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

const BASIC_PREFIX = 'Basic ';

export function swaggerBasicAuthMiddleware(username: string, password: string) {
  const expected = Buffer.from(`${username}:${password}`);

  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (header?.startsWith(BASIC_PREFIX)) {
      const provided = Buffer.from(header.slice(BASIC_PREFIX.length), 'base64');

      if (
        provided.length === expected.length &&
        timingSafeEqual(provided, expected)
      ) {
        next();
        return;
      }
    }

    res.setHeader('WWW-Authenticate', 'Basic realm="Swagger"');
    res.status(401).send('Unauthorized');
  };
}
