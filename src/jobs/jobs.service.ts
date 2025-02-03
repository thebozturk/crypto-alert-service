import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { AppLogger } from '../logger/logger.service';

@Injectable()
export class JobsService {
  private readonly logger = new AppLogger();

  constructor(@InjectQueue('alert-queue') private readonly alertQueue: Queue) {}

  async addAlertCheckJob() {
    this.logger.log('🕒 Adding job to queue: Checking alerts every 30 seconds');

    await this.alertQueue.add(
      'check-alerts',
      {},
      {
        repeat: {
          every: 30000,
        },
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }
}
