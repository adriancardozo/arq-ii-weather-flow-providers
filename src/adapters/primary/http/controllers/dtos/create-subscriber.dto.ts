import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateSubscriberInput } from 'src/bussiness/ports/input/services/dtos/input/create-subscriber.input';
import { Location } from 'src/bussiness/value-objects/location.value-object';

export class CreateSubscriberDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  external_id: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
  @ApiProperty({ enum: ['OpenWeatherMap'] })
  @IsNotEmpty()
  @IsIn(['OpenWeatherMap'])
  provider: string;
  @ApiProperty({ type: 'number' })
  @IsNotEmpty()
  @IsNumber()
  longitude: number;
  @ApiProperty({ type: 'number' })
  @IsNotEmpty()
  @IsNumber()
  latitude: number;
  @ApiProperty({ enum: ['MeasurementQueue'] })
  @IsNotEmpty()
  @IsIn(['MeasurementQueue'])
  notifier: string;

  toInput(): CreateSubscriberInput {
    return new CreateSubscriberInput(
      this.external_id,
      this.name,
      this.provider,
      new Location([this.longitude, this.latitude]),
      this.notifier,
    );
  }
}
