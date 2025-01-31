import { IsString, IsNumber, Min } from 'class-validator';

export class CreateAlertDto {
  @IsString()
  coin: string;

  @IsNumber()
  @Min(0)
  targetPrice: number;
}
