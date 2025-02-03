import { Controller, UseGuards } from '@nestjs/common';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';

@UseGuards(RateLimitGuard)
@Controller('users')
export class UsersController {
  constructor() {}
}
