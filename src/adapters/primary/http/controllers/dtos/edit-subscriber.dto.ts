import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { EditSubscriberInput } from 'src/bussiness/ports/input/services/dtos/input/edit-subscriber.input';

export class EditSubscriberDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  external_id?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;
  @ApiProperty()
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
  @ApiProperty()
  @IsOptional()
  @IsIn(['MeasurementQueue'])
  notifier?: string;

  toInput(): EditSubscriberInput {
    return new EditSubscriberInput(
      this.external_id,
      this.name,
      this.provider,
      this.longitude,
      this.latitude,
      this.notifier,
    );
  }
}
