import { Processor, Process } from '@nestjs/bull';
import { AlertsService } from '../alerts/alerts.service';
import { MailService } from '../mail/mail.service';
import axios from 'axios';
import { Job } from 'bullmq';

@Processor('alert-queue')
export class JobsProcessor {
  constructor(
    private readonly alertsService: AlertsService,
    private readonly mailService: MailService,
  ) {}

  @Process()
  async handleJob(job: Job) {
    const alerts = await this.alertsService.findUserAlerts(job.data.userId);

    for (const alert of alerts) {
      try {
        const priceData = await axios.get(
          `${process.env.COINGECKO_API}?ids=${alert.coin}&vs_currencies=usd`,
        );
        const currentPrice = priceData.data[alert.coin]?.usd;

        if (currentPrice && currentPrice >= alert.targetPrice) {
          console.log(
            `🔔 ALERT: ${alert.coin} price reached ${alert.targetPrice} USD!`,
          );

          // Send an email notification to the user
          await this.mailService.sendEmail(
            alert.user.email,
            `🚀 ${alert.coin.toUpperCase()} Price Alert Triggered!`,
            `Hello,\n\nYour price alert for ${alert.coin.toUpperCase()} has been triggered.\n\n` +
              `The current price is: ${currentPrice} USD\n\n` +
              `You set an alert for: ${alert.targetPrice} USD\n\n` +
              `Thank you for using our service!`,
          );

          // Mark the alert as "triggered"
          alert.status = 'triggered';
          await this.alertsService.updateAlert(alert.id, {
            status: 'triggered',
          });
        }
      } catch (error) {
        console.error(`❌ Error occurred: ${error.message}`);
      }
    }
  }
}
