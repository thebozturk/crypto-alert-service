import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AppLogger } from '../../logger/logger.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ErrorService {
  constructor(private readonly logger: AppLogger) {}

  handleDatabaseError(error: any): never {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': {
          const message = 'Unique constraint violation: ' + error.message;
          this.logger.error(message, error.stack);
          throw new BadRequestException(message);
        }
        case 'P2003': {
          const message = 'Foreign key constraint violation: ' + error.message;
          this.logger.error(message, error.stack);
          throw new BadRequestException(message);
        }
        case 'P2025': {
          const message = 'Record not found: ' + error.message;
          this.logger.error(message, error.stack);
          throw new BadRequestException(message);
        }
      }
    }

    const message = 'Database error: ' + error.message;
    this.logger.error(message, error.stack);
    throw new InternalServerErrorException(message);
  }

  handleExternalApiError(error: any): never {
    throw new InternalServerErrorException(
      'External API error: ' + error.message,
    );
  }
}
