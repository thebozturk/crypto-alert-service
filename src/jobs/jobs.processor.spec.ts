import { Test, TestingModule } from '@nestjs/testing';
import { JobsProcessor } from './jobs.processor';
import { PrismaService } from '../prisma/prisma.service';
import { AlertsService } from '../alerts/alerts.service';
import axios from 'axios';
import { AppLogger } from '../logger/logger.service';
import { ConfigService } from '@nestjs/config';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('JobsProcessor', () => {
  let processor: JobsProcessor;
  let prismaService: PrismaService;
  let alertsService: AlertsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsProcessor,
        {
          provide: PrismaService,
          useValue: {
            alert: {
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: AlertsService,
          useValue: {
            updateAlert: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue({
              apiUrl: 'https://api.coingecko.com/api/v3/simple/price',
              timeout: 5000,
            }),
          },
        },
      ],
    }).compile();

    processor = module.get<JobsProcessor>(JobsProcessor);
    prismaService = module.get<PrismaService>(PrismaService);
    alertsService = module.get<AlertsService>(AlertsService);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  describe('handleJob', () => {
    beforeEach(() => {
      process.env.COINGECKO_API =
        'https://api.coingecko.com/api/v3/simple/price';
    });

    it('should handle job with no active alerts', async () => {
      jest.spyOn(prismaService.alert, 'findMany').mockResolvedValue([]);
      const logSpy = jest.spyOn(AppLogger.prototype, 'log');

      await processor.handleJob({} as any);

      expect(logSpy).toHaveBeenCalledWith(
        '✅ No active alerts found, job completed.',
      );
    });

    it('should process active alerts and update triggered alerts', async () => {
      const mockAlerts = [
        {
          id: '1',
          coin: 'bitcoin',
          targetPrice: 50000,
          status: 'active',
          userId: 'user1',
        },
      ];

      const mockPrice = {
        bitcoin: {
          usd: 51000,
        },
      };

      jest.spyOn(prismaService.alert, 'findMany').mockResolvedValue(mockAlerts);
      mockedAxios.get.mockResolvedValue({ data: mockPrice });

      await processor.handleJob({} as any);

      expect(alertsService.updateAlert).toHaveBeenCalledWith('1', {
        status: 'triggered',
      });
    });

    it('should handle API errors gracefully', async () => {
      const mockAlerts = [
        {
          id: '1',
          coin: 'bitcoin',
          targetPrice: 50000,
          status: 'active',
          userId: 'user1',
        },
      ];

      jest.spyOn(prismaService.alert, 'findMany').mockResolvedValue(mockAlerts);
      mockedAxios.get.mockRejectedValue(new Error('API Error'));
      const errorSpy = jest.spyOn(AppLogger.prototype, 'error');

      await processor.handleJob({} as any);

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error processing alert for bitcoin'),
      );
    });

    it('should not update alert if price is below target', async () => {
      const mockAlerts = [
        {
          id: '1',
          coin: 'bitcoin',
          targetPrice: 50000,
          status: 'active',
          userId: 'user1',
        },
      ];

      const mockPrice = {
        bitcoin: {
          usd: 49000,
        },
      };

      jest.spyOn(prismaService.alert, 'findMany').mockResolvedValue(mockAlerts);
      mockedAxios.get.mockResolvedValue({ data: mockPrice });

      await processor.handleJob({} as any);

      expect(alertsService.updateAlert).not.toHaveBeenCalled();
    });
  });
});
