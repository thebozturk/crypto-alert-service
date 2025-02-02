import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    rolesGuard = new RolesGuard(reflector);
  });

  const mockExecutionContext = (userRole?: string) => {
    return {
      getHandler: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          user: userRole ? { role: userRole } : undefined,
        }),
      }),
    } as unknown as ExecutionContext;
  };

  it('should be defined', () => {
    expect(rolesGuard).toBeDefined();
  });

  it('should allow access if no roles are required', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(undefined);
    expect(rolesGuard.canActivate(mockExecutionContext('user'))).toBe(true);
  });

  it('should allow access if user has required role', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);
    expect(rolesGuard.canActivate(mockExecutionContext('admin'))).toBe(true);
  });

  it('should deny access if user does not have required role', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);

    expect(() => rolesGuard.canActivate(mockExecutionContext('user'))).toThrow(
      new ForbiddenException(
        'You do not have permission to access this resource',
      ),
    );
  });

  it('should deny access if no user is found in request', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);

    expect(() =>
      rolesGuard.canActivate(mockExecutionContext(undefined)),
    ).toThrow(
      new ForbiddenException(
        'You do not have permission to access this resource',
      ),
    );
  });
});
