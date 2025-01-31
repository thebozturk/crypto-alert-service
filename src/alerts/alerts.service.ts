import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from './alert.entity';
import { CreateAlertDto } from './dto/create-alert.dto';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
  ) {}

  createAlert(userId: string, createAlertDto: CreateAlertDto) {
    const alert = this.alertRepository.create({
      ...createAlertDto,
      user: { id: userId },
    });
    return this.alertRepository.save(alert);
  }

  findUserAlerts(userId: string) {
    return this.alertRepository.find({ where: { user: { id: userId } } });
  }

  deleteAlert(alertId: string) {
    return this.alertRepository.delete(alertId);
  }
}
