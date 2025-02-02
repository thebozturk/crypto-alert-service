import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/decorators/roles.decorator';
import {
  SwaggerUsersController,
  SwaggerGetAllUsers,
  SwaggerGetProfile,
} from '../decorators/swagger.decorator';
import { AppLogger } from '../logger/logger.service';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';

@SwaggerUsersController()
@UseGuards(RateLimitGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: AppLogger,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('all')
  @SwaggerGetAllUsers()
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @SwaggerGetProfile()
  async getProfile(@Request() req) {
    this.logger.log(`User Profile Requested: ${req.user.sub}`);
    return this.usersService.findById(req.user.sub);
  }
}
