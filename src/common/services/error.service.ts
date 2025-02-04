import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ErrorService {
  handleDatabaseError(error: any): never {
    throw new HttpException(
      'Database operation failed: ' + error.message,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  handleExternalApiError(error: any): never {
    throw new HttpException(
      'External API error: ' + error.message,
      HttpStatus.BAD_GATEWAY,
    );
  }
}
