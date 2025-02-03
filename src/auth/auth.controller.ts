import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  ConflictException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';
import { SwaggerExamples } from '../swagger/swagger-examples';

@ApiTags('Auth')
@UseGuards(RateLimitGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'User Registration' })
  @ApiBody({
    schema: {
      example: SwaggerExamples.registerRequest.example,
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    ...SwaggerExamples.registerResponse,
  })
  @HttpCode(201)
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register(
        registerDto.email,
        registerDto.password,
      );
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw error;
    }
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'User Login' })
  @ApiBody({
    schema: {
      example: SwaggerExamples.loginRequest.example,
    },
  })
  @ApiResponse({
    status: 200,
    description: 'JWT token returned',
    ...SwaggerExamples.loginResponse,
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }
}
