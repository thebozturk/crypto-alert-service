import { Alert } from '@prisma/client';

export interface IAlertService {
  createAlert(
    userId: string,
    coin: string,
    targetPrice: number,
  ): Promise<Alert>;
  findUserAlerts(userId: string): Promise<Alert[]>;
  findActiveAlerts(userId: string): Promise<Alert[]>;
  updateAlert(id: string, data: Partial<Alert>): Promise<Alert>;
  deleteAlert(id: string): Promise<Alert>;
}
