import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { getQueueToken } from '@nestjs/bull';
import { AppLogger } from '../logger/logger.service';

describe('JobsService', () => {
  let service: JobsService;
  let mockQueue: any;

  beforeEach(async () => {
    mockQueue = {
      add: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        {
          provide: getQueueToken('alert-queue'),
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addAlertCheckJob', () => {
    it('should add a job to the queue with correct options', async () => {
      await service.addAlertCheckJob();

      expect(mockQueue.add).toHaveBeenCalledWith(
        'check-alerts',
        {},
        {
          repeat: {
            every: 30000,
          },
          removeOnComplete: true,
          removeOnFail: true,
        },
      );
    });

    it('should log when adding the job', async () => {
      const logSpy = jest.spyOn(AppLogger.prototype, 'log');

      await service.addAlertCheckJob();

      expect(logSpy).toHaveBeenCalledWith(
        '🕒 Adding job to queue: Checking alerts every 30 seconds',
      );
    });
  });
});
