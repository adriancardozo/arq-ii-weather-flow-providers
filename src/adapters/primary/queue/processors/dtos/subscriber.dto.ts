import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, ValidateIf, ValidateNested } from 'class-validator';
import { CreateSubscriberDto } from './create-subscriber.dto';
import { Type } from 'class-transformer';
import { DeleteExternalSubscriberDto } from './delete-external-subscriber.dto';
import { EditExternalSubscriberDto } from './edit-external-subscriber.dto';

export class SubscriberDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsIn(['create', 'edit', 'delete'])
  type: 'create' | 'edit' | 'delete';
  @ValidateIf(({ type }) => type === 'create')
  @ApiProperty({ type: CreateSubscriberDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateSubscriberDto)
  create_dto: CreateSubscriberDto;
  @ValidateIf(({ type }) => type === 'edit')
  @ApiProperty({ type: EditExternalSubscriberDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => EditExternalSubscriberDto)
  edit_dto: EditExternalSubscriberDto;
  @ValidateIf(({ type }) => type === 'delete')
  @ApiProperty({ type: DeleteExternalSubscriberDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DeleteExternalSubscriberDto)
  delete_dto: DeleteExternalSubscriberDto;
}
