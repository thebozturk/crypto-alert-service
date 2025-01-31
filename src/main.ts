import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { WinstonLogger } from './common/logger/winston-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet()); // Set up security-related HTTP headers
  app.useGlobalFilters(new HttpExceptionFilter()); // Apply the global exception filter
  const logger = new WinstonLogger();
  app.useLogger(logger); // Use the WinstonLogger class as the global logger
  await app.listen(3000);
}
bootstrap();
