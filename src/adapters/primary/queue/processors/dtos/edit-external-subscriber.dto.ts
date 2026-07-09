import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { EditExternalSubscriberInput } from 'src/bussiness/ports/input/services/dtos/input/edit-external-subscriber.input';

export class EditExternalSubscriberDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  external_id: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;
  @ApiProperty({ enum: ['OpenWeatherMap'] })
  @IsOptional()
  @IsIn(['OpenWeatherMap'])
  provider?: string;
  @ApiProperty({ type: 'number' })
  @IsOptional()
  @IsNumber()
  longitude?: number;
  @ApiProperty({ type: 'number' })
  @IsOptional()
  @IsNumber()
  latitude?: number;
  @ApiProperty({ enum: ['MeasurementQueue'] })
  @IsOptional()
  @IsIn(['MeasurementQueue'])
  notifier?: string;

  toInput(): EditExternalSubscriberInput {
    return new EditExternalSubscriberInput(
      this.external_id,
      this.name,
      this.provider,
      this.longitude,
      this.latitude,
      this.notifier,
    );
  }
}
