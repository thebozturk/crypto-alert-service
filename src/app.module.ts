import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AlertsModule } from './alerts/alerts.module';
import { JobsModule } from './jobs/jobs.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from './logger/logger.module';
import { MonitoringModule } from './monitoring/monitoring.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule,
    MonitoringModule,
    PrismaModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60, // seconds
        limit: 10, // requests
      },
    ]),
    UsersModule,
    AuthModule,
    AlertsModule,
    JobsModule,
  ],
})
export class AppModule {}
