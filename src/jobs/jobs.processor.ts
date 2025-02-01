import { Processor, Process } from '@nestjs/bull';
import { AlertsService } from '../alerts/alerts.service';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Processor('alert-queue')
export class JobsProcessor {
  constructor(
    private readonly prisma: PrismaService,
    private readonly alertsService: AlertsService,
    private readonly mailService: MailService,
  ) {}

  @Process()
  async handleJob() {
    console.log('🔄 Checking alerts...');

    // get all active alerts
    const alerts = await this.prisma.alert.findMany({
      where: { status: 'active' },
    });

    for (const alert of alerts) {
      try {
        // get current price of the coin from CoinGecko API
        const response = await axios.get(
          `${process.env.COINGECKO_API}?ids=${alert.coin}&vs_currencies=usd`,
        );
        const currentPrice = response.data[alert.coin]?.usd;

        if (currentPrice && currentPrice >= alert.targetPrice) {
          console.log(
            `✅ ALERT TRIGGERED: ${alert.coin} reached ${alert.targetPrice} USD!`,
          );

          // get user details
          const user = await this.prisma.user.findUnique({
            where: { id: alert.userId },
          });

          if (user) {
            // send email to user with alert details
            await this.mailService.sendEmail(
              user.email,
              `🚀 ${alert.coin.toUpperCase()} Price Alert Triggered!`,
              `Hello,\n\nYour price alert for ${alert.coin.toUpperCase()} has been triggered.\n\n` +
                `The current price is: ${currentPrice} USD\n\n` +
                `Thank you for using our service!`,
            );

            // update alert status
            await this.alertsService.updateAlert(alert.id, {
              status: 'triggered',
            });
          }
        }
      } catch (error) {
        console.error(
          `❌ Error processing alert for ${alert.coin}:`,
          error.message,
        );
      }
    }
  }
}
