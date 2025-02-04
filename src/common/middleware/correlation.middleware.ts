import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * Middleware that adds correlation ID tracking to requests
 *
 * @description
 * This middleware generates or propagates a correlation ID for request tracing.
 * It will:
 * 1. Check if incoming request has an x-correlation-id header
 * 2. If not, generate a new UUID v4
 * 3. Attach the correlation ID to both request and response
 */
@Injectable()
export class CorrelationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const correlationId = req.headers['x-correlation-id'] || uuidv4();
    req['correlationId'] = correlationId;
    res.setHeader('x-correlation-id', correlationId);
    next();
  }
}
