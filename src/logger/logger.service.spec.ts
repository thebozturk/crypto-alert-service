import { Test, TestingModule } from '@nestjs/testing';
import * as winston from 'winston';
import { AppLogger } from './logger.service';

describe('AppLogger', () => {
  let logger: AppLogger;
  let winstonLoggerMock: jest.Mocked<winston.Logger>;

  beforeEach(async () => {
    winstonLoggerMock = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    } as unknown as jest.Mocked<winston.Logger>;

    jest.spyOn(winston, 'createLogger').mockReturnValue(winstonLoggerMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [AppLogger],
    }).compile();

    logger = module.get<AppLogger>(AppLogger);
  });

  it('should be defined', () => {
    expect(logger).toBeDefined();
  });

  it('should call winston info when log is called', () => {
    logger.log('Test log message');
    expect(winstonLoggerMock.info).toHaveBeenCalledWith('Test log message');
  });

  it('should call winston error when error is called', () => {
    logger.error('Test error message', 'Test Stack Trace');
    expect(winstonLoggerMock.error).toHaveBeenCalledWith(
      'Test error message',
      'Test Stack Trace',
    );
  });

  it('should call winston warn when warn is called', () => {
    logger.warn('Test warning message');
    expect(winstonLoggerMock.warn).toHaveBeenCalledWith('Test warning message');
  });
});
