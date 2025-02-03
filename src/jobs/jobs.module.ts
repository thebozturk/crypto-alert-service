import { Module, OnModuleInit } from '@nestjs/common';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { JobsProcessor } from './jobs.processor';
import { JobsService } from './jobs.service';
import { AlertsService } from '../alerts/alerts.service';
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
  providers: [JobsProcessor, JobsService, AlertsService],
  exports: [JobsService],
})
export class JobsModule implements OnModuleInit {
  constructor(@InjectQueue('alert-queue') private readonly alertQueue: Queue) {}

  async onModuleInit() {
    try {
      await this.alertQueue.client.ping();
      console.log('✅ Successfully connected to Redis');
    } catch (error) {
      console.error('❌ Failed to connect to Redis:', error.message);
    }
  }
}
