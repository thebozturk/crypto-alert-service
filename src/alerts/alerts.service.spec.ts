import { Test, TestingModule } from '@nestjs/testing';
import { AlertsService } from '../../src/alerts/alerts.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Alert } from '@prisma/client';
import { ErrorService } from '../common/services/error.service';

describe('AlertsService', () => {
  let alertsService: AlertsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertsService,
        PrismaService,
        {
          provide: ErrorService,
          useValue: {
            handleDatabaseError: jest.fn(),
          },
        },
      ],
    }).compile();
    alertsService = module.get<AlertsService>(AlertsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(alertsService).toBeDefined();
  });

  describe('createAlert', () => {
    it('should create an alert', async () => {
      const mockAlert: Alert = {
        id: 'alert-123',
        userId: 'user-123',
        coin: 'bitcoin',
        targetPrice: 50000,
        status: 'active',
      };

      jest.spyOn(prismaService.alert, 'create').mockResolvedValue(mockAlert);

      const result = await alertsService.createAlert(
        'user-123',
        'bitcoin',
        50000,
      );
      expect(result).toEqual(mockAlert);
      expect(prismaService.alert.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-123',
          coin: 'bitcoin',
          targetPrice: 50000,
          status: 'active',
        },
      });
    });
  });

  describe('findUserAlerts', () => {
    it('should return all alerts for a user', async () => {
      const mockAlerts: Alert[] = [
        {
          id: 'alert-1',
          userId: 'user-123',
          coin: 'bitcoin',
          targetPrice: 50000,
          status: 'active',
        },
        {
          id: 'alert-2',
          userId: 'user-123',
          coin: 'ethereum',
          targetPrice: 3000,
          status: 'triggered',
        },
      ];

      jest.spyOn(prismaService.alert, 'findMany').mockResolvedValue(mockAlerts);

      const result = await alertsService.findUserAlerts('user-123');
      expect(result).toEqual(mockAlerts);
      expect(prismaService.alert.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
      });
    });
  });

  describe('updateAlert', () => {
    it('should update an alert', async () => {
      const updatedAlert: Alert = {
        id: 'alert-1',
        userId: 'user-123',
        coin: 'bitcoin',
        targetPrice: 60000,
        status: 'active',
      };

      jest.spyOn(prismaService.alert, 'update').mockResolvedValue(updatedAlert);

      const result = await alertsService.updateAlert('alert-1', {
        targetPrice: 60000,
      });
      expect(result).toEqual(updatedAlert);
      expect(prismaService.alert.update).toHaveBeenCalledWith({
        where: { id: 'alert-1' },
        data: { targetPrice: 60000 },
      });
    });
  });

  describe('deleteAlert', () => {
    it('should delete an alert', async () => {
      const mockAlert: Alert = {
        id: 'alert-1',
        userId: 'user-123',
        coin: 'bitcoin',
        targetPrice: 50000,
        status: 'active',
      };

      jest
        .spyOn(prismaService.alert, 'findUnique')
        .mockResolvedValue(mockAlert);

      jest.spyOn(prismaService.alert, 'delete').mockResolvedValue(mockAlert);

      const result = await alertsService.deleteAlert('alert-1');

      expect(result).toEqual(mockAlert);
      expect(prismaService.alert.findUnique).toHaveBeenCalledWith({
        where: { id: 'alert-1' },
      });
      expect(prismaService.alert.delete).toHaveBeenCalledWith({
        where: { id: 'alert-1' },
      });
    });
  });

  describe('findActiveAlerts', () => {
    it('should return active alerts for a user', async () => {
      const mockActiveAlerts: Alert[] = [
        {
          id: 'alert-1',
          userId: 'user-123',
          coin: 'bitcoin',
          targetPrice: 50000,
          status: 'active',
        },
      ];

      jest
        .spyOn(prismaService.alert, 'findMany')
        .mockResolvedValue(mockActiveAlerts);

      const result = await alertsService.findActiveAlerts('user-123');
      expect(result).toEqual(mockActiveAlerts);
      expect(prismaService.alert.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-123', status: 'active' },
      });
    });
  });
});
