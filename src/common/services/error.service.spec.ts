import { Test, TestingModule } from '@nestjs/testing';
import { ErrorService } from './error.service';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppLogger } from '../../logger/logger.service';

describe('ErrorService', () => {
  let service: ErrorService;
  let logger: AppLogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ErrorService,
        {
          provide: AppLogger,
          useValue: {
            error: jest.fn(),
            warn: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ErrorService>(ErrorService);
    logger = module.get<AppLogger>(AppLogger);
  });

  describe('handleDatabaseError', () => {
    it('should handle Prisma unique constraint violation', () => {
      const prismaError = new PrismaClientKnownRequestError(
        'Unique constraint failed',
        {
          code: 'P2002',
          clientVersion: '4.0.0',
        },
      );

      expect(() => service.handleDatabaseError(prismaError)).toThrow(
        BadRequestException,
      );
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Unique constraint violation'),
        expect.any(String),
      );
    });

    it('should handle Prisma foreign key constraint violation', () => {
      const prismaError = new PrismaClientKnownRequestError(
        'Foreign key constraint failed',
        {
          code: 'P2003',
          clientVersion: '4.0.0',
        },
      );

      expect(() => service.handleDatabaseError(prismaError)).toThrow(
        BadRequestException,
      );
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Foreign key constraint violation'),
        expect.any(String),
      );
    });

    it('should handle Prisma record not found', () => {
      const prismaError = new PrismaClientKnownRequestError(
        'Record not found',
        {
          code: 'P2025',
          clientVersion: '4.0.0',
        },
      );

      expect(() => service.handleDatabaseError(prismaError)).toThrow(
        BadRequestException,
      );
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Record not found'),
        expect.any(String),
      );
    });

    it('should handle unknown database errors', () => {
      const unknownError = new Error('Unknown database error');

      expect(() => service.handleDatabaseError(unknownError)).toThrow(
        InternalServerErrorException,
      );
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Database error'),
        expect.any(String),
      );
    });
  });
});
