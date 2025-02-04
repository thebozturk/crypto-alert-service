import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AppLogger } from './logger/logger.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JobsService } from './jobs/jobs.service';
import { CorrelationMiddleware } from './common/middleware/correlation.middleware';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.use(new CorrelationMiddleware().use);
    const logger = new AppLogger();

    app.enableCors();
    app.use(helmet());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useLogger(logger);

    const config = new DocumentBuilder()
      .setTitle('Crypto Price Alert Service')
      .setDescription('Crypto price tracking and alerting API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
    console.log(`🚀 API running on: http://localhost:3000`);
    console.log(
      `📊 Prometheus metrics available at: http://localhost:3000/metrics`,
    );

    // Initialize the job service after the app is running
    const jobsService = app.get(JobsService);
    await jobsService.addAlertCheckJob();
    console.log('✅ Alert check job scheduled successfully');
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();
