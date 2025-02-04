import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Alert } from '@prisma/client';
import { ErrorService } from '../common/services/error.service';

@Injectable()
export class AlertsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly errorService: ErrorService,
  ) {}

  /**
   * Creates a new price alert for a cryptocurrency
   * @param userId - The ID of the user creating the alert
   * @param coin - The cryptocurrency to monitor
   * @param targetPrice - The price threshold to trigger the alert
   * @returns Promise<Alert> - The created alert
   * @throws BadRequestException if user doesn't exist
   */
  async createAlert(
    userId: string,
    coin: string,
    targetPrice: number,
  ): Promise<Alert> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        this.errorService.handleDatabaseError(new Error('User does not exist'));
      }
      return await this.prisma.alert.create({
        data: { userId, coin, targetPrice, status: 'active' },
      });
    } catch (error) {
      this.errorService.handleDatabaseError(error);
    }
  }

  async findUserAlerts(userId: string): Promise<Alert[]> {
    if (!userId) {
      throw new Error('User ID is required to fetch alerts.');
    }

    return this.prisma.alert.findMany({ where: { userId } });
  }

  async updateAlert(alertId: string, data: Partial<Alert>): Promise<Alert> {
    return this.prisma.alert.update({
      where: { id: alertId },
      data,
    });
  }

  async deleteAlert(alertId: string): Promise<Alert> {
    const alert = await this.prisma.alert.findUnique({
      where: { id: alertId },
    });

    if (!alert) {
      throw new Error(`Alert with id ${alertId} not found.`);
    }

    return this.prisma.alert.delete({
      where: { id: alert.id },
    });
  }

  async findActiveAlerts(userId: string): Promise<Alert[]> {
    if (!userId) {
      throw new Error('User ID is required to fetch active alerts.');
    }

    return this.prisma.alert.findMany({ where: { userId, status: 'active' } });
  }
}
