import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteExternalSubscriberDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  external_id: string;
}
