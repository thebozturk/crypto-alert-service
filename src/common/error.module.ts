import { Module } from '@nestjs/common';
import { ErrorService } from './services/error.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [ErrorService],
  exports: [ErrorService],
})
export class ErrorModule {}
