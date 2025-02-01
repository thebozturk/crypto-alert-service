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
    return this.prisma.alert.create({
      data: { userId, coin, targetPrice, status: 'active' },
    });
  }

  async findUserAlerts(userId: string): Promise<Alert[]> {
    return this.prisma.alert.findMany({ where: { userId } });
  }

  async updateAlert(alertId: string, data: Partial<Alert>): Promise<Alert> {
    return this.prisma.alert.update({
      where: { id: alertId },
      data,
    });
  }

  async deleteAlert(alertId: string): Promise<Alert> {
    return this.prisma.alert.delete({ where: { id: alertId } });
  }

  findActiveAlerts(userId: string): Promise<Alert[]> {
    return this.prisma.alert.findMany({
      where: { userId, status: 'active' },
    });
  }
}
