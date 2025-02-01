import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';

@ApiTags('Alerts')
@ApiBearerAuth()
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  @UseGuards(RateLimitGuard)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new price alert' })
  createAlert(@Request() req, @Body() createAlertDto: CreateAlertDto) {
    return this.alertsService.createAlert(
      req.user.userId,
      createAlertDto.coin,
      createAlertDto.targetPrice,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all alerts for the authenticated user' })
  findUserAlerts(@Request() req) {
    return this.alertsService.findUserAlerts(req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a specific alert' })
  deleteAlert(@Param('id') id: string) {
    return this.alertsService.deleteAlert(id);
  }
}
