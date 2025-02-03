import { AlertsService } from '../alerts/alerts.service';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';
import { Job } from 'bullmq';
import { Process, Processor } from '@nestjs/bull';
import { AppLogger } from '../logger/logger.service';

@Processor('alert-queue')
export class JobsProcessor {
  private readonly logger = new AppLogger();

  constructor(
    private readonly prisma: PrismaService,
    private readonly alertsService: AlertsService,
  ) {}

  @Process('check-alerts')
  async handleJob(_job: Job) {
    this.logger.log('🔄 Job started: Checking active alerts...');

    try {
      const alerts = await this.prisma.alert.findMany({
        where: { status: 'active' },
      });

      this.logger.log(`🔍 Found ${alerts.length} active alerts.`);

      if (alerts.length === 0) {
        this.logger.log('✅ No active alerts found, job completed.');
        return;
      }

      for (const alert of alerts) {
        try {
          this.logger.log(
            `⚡ Checking price for ${alert.coin}, target: ${alert.targetPrice} USD`,
          );

          const response = await axios.get(
            `${process.env.COINGECKO_API}?ids=${alert.coin}&vs_currencies=usd`,
          );

          this.logger.log(`📊 API Response: ${JSON.stringify(response.data)}`);

          const currentPrice = response.data[alert.coin]?.usd;
          this.logger.log(
            `💰 Current price of ${alert.coin}: ${currentPrice} USD`,
          );

          if (currentPrice && currentPrice >= alert.targetPrice) {
            this.logger.warn(
              `🚨 ALERT TRIGGERED: ${alert.coin} has reached ${alert.targetPrice} USD!`,
            );

            await this.alertsService.updateAlert(alert.id, {
              status: 'triggered',
            });
            this.logger.log(
              `🔄 Alert status updated to "triggered" for alert ID: ${alert.id}`,
            );
          }
        } catch (error) {
          this.logger.error(
            `❌ Error processing alert for ${alert.coin}: ${error.message}`,
          );
        }
      }
    } catch (error) {
      this.logger.error(`❌ Error retrieving alerts: ${error.message}`);
    }

    this.logger.log('✅ Job completed successfully.');
  }
}
