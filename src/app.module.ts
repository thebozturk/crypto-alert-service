import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AlertsModule } from './alerts/alerts.module';
import { JobsModule } from './jobs/jobs.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60, // 60 seconds
      limit: 10, // 10 requests max
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    AlertsModule,
    JobsModule,
  ],
})
export class AppModule {}
