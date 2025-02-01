import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min } from 'class-validator';

export class CreateAlertDto {
  @ApiProperty({ example: 'bitcoin' })
  @IsString()
  coin: string;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  @Min(0)
  targetPrice: number;
}
