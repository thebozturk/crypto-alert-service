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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';
import { SwaggerExamples } from '../swagger/swagger-examples';

@ApiTags('Alerts')
@ApiBearerAuth()
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  @UseGuards(RateLimitGuard)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new price alert' })
  @ApiBody({
    schema: {
      example: SwaggerExamples.createAlertRequest.example,
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Alert created successfully',
    ...SwaggerExamples.createAlertResponse,
  })
  createAlert(@Request() req, @Body() createAlertDto: CreateAlertDto) {
    return this.alertsService.createAlert(
      req.user.sub,
      createAlertDto.coin,
      createAlertDto.targetPrice,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all alerts for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Alerts retrieved successfully',
    ...SwaggerExamples.getAlertsResponse,
  })
  findUserAlerts(@Request() req) {
    return this.alertsService.findUserAlerts(req.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a specific alert' })
  deleteAlert(@Param('id') id: string) {
    return this.alertsService.deleteAlert(id);
  }
}
