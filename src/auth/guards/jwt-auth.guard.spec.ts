import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let jwtAuthGuard: JwtAuthGuard;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService({ secret: 'test-secret' });
    jwtAuthGuard = new JwtAuthGuard(jwtService);
  });

  it('should be defined', () => {
    expect(jwtAuthGuard).toBeDefined();
  });

  it('should return true for valid token', () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer valid-token',
          },
          user: {},
        }),
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(jwtService, 'verify').mockReturnValue({ userId: '123' });

    expect(jwtAuthGuard.canActivate(mockExecutionContext)).toBe(true);
  });

  it('should throw UnauthorizedException if no authorization header', () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    } as unknown as ExecutionContext;

    expect(() => jwtAuthGuard.canActivate(mockExecutionContext)).toThrow(
      new UnauthorizedException('Missing or invalid authorization header'),
    );
  });

  it('should throw UnauthorizedException if token is invalid', () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer invalid-token',
          },
        }),
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(jwtService, 'verify').mockImplementation(() => {
      throw new Error('Invalid token');
    });

    expect(() => jwtAuthGuard.canActivate(mockExecutionContext)).toThrow(
      new UnauthorizedException('Invalid or expired token'),
    );
  });
});
