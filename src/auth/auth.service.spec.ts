import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { UsersService } from '../../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked-jwt-token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should register a user with hashed password', async () => {
      jest.spyOn(usersService, 'createUser').mockResolvedValue({
        id: '123',
        email: 'test@example.com',
        password: 'hashedpassword',
        role: 'user',
      });

      const result = await authService.register(
        'test@example.com',
        'plainpassword',
      );
      expect(usersService.createUser).toHaveBeenCalledWith(
        'test@example.com',
        expect.any(String),
        'user',
      );
      expect(result.email).toBe('test@example.com');
    });
  });

  describe('login', () => {
    it('should return JWT token if credentials are valid', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue({
        id: '123',
        email: 'test@example.com',
        password: await bcrypt.hash('validpassword', 10),
        role: 'user',
      });

      const result = await authService.login(
        'test@example.com',
        'validpassword',
      );

      expect(result).toHaveProperty('access_token', 'mocked-jwt-token');
      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: 'test@example.com',
        sub: '123',
      });
    });

    it('should throw UnauthorizedException if email is not found', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      await expect(
        authService.login('wrong@example.com', 'validpassword'),
      ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue({
        id: '123',
        email: 'test@example.com',
        password: await bcrypt.hash('validpassword', 10),
        role: 'user',
      });

      await expect(
        authService.login('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
    });
  });
});
