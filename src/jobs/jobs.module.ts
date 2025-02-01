import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { JobsProcessor } from './jobs.processor';
import { AlertsService } from '../alerts/alerts.service';
import { MailService } from '../mail/mail.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'alert-queue',
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
  ],
  providers: [JobsProcessor, AlertsService, MailService],
})
export class JobsModule {}
