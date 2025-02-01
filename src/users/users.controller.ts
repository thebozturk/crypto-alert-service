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

@SwaggerUsersController()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
    return this.usersService.findById(req.user.sub);
  }
}
