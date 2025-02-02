import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Alert } from '@prisma/client';

@Injectable()
export class AlertsService {
  constructor(private readonly prisma: PrismaService) {}

  async createAlert(
    userId: string,
    coin: string,
    targetPrice: number,
  ): Promise<Alert> {
    if (!userId) {
      throw new Error('User ID is required to create an alert.');
    }

    return this.prisma.alert.create({
      data: { userId, coin, targetPrice, status: 'active' },
    });
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
