import { Processor, Process } from '@nestjs/bull';
import { AlertsService } from '../alerts/alerts.service';
import axios from 'axios';
import { Job } from 'bullmq';

@Processor('alert-queue')
export class JobsProcessor {
  constructor(private readonly alertsService: AlertsService) {}

  @Process()
  async handleJob(job: Job) {
    const alerts = await this.alertsService.findUserAlerts(job.data.userId);
    for (const alert of alerts) {
      const priceData = await axios.get(
        `${process.env.COINGECKO_API}?ids=${alert.coin}&vs_currencies=usd`,
      );
      const currentPrice = priceData.data[alert.coin]?.usd;
      if (currentPrice && currentPrice >= alert.targetPrice) {
        console.log(`ALERT: ${alert.coin} price reached ${alert.targetPrice}`);
      }
    }
  }
}
