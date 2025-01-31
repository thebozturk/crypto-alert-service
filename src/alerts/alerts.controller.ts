import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Alerts')
@ApiBearerAuth()
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createAlert(@Request() req, @Body() createAlertDto: CreateAlertDto) {
    return this.alertsService.createAlert(req.user.userId, createAlertDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findUserAlerts(@Request() req) {
    return this.alertsService.findUserAlerts(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteAlert(@Param('id') id: string) {
    return this.alertsService.deleteAlert(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('active')
  findActiveAlerts(@Request() req) {
    return this.alertsService.findUserAlerts(req.user.userId, 'active');
  }
}
