import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class JobsService {
  constructor(@InjectQueue('alert-queue') private readonly alertQueue: Queue) {}

  async addAlertCheckJob() {
    await this.alertQueue.add({}, { repeat: { every: 30000 } }); //  every 30 seconds
  }
}
