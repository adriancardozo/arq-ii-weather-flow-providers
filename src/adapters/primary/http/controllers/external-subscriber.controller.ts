import { Body, Controller, Delete, Logger, Param, Patch, UseFilters, UsePipes } from '@nestjs/common';
import { VALIDATION_PIPE } from 'src/infrastructure/validation/validation.pipe';
import { BussinessExceptionFilter } from './filters/bussiness-error.filter';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ISubscriberService } from 'src/bussiness/ports/input/services/i-subscriber.service';
import { SubscriberResponse } from './responses/subscriber.response';
import { EditExternalSubscriberDto } from '../../queue/processors/dtos/edit-external-subscriber.dto';

@Controller('external_subscriber')
@UsePipes(VALIDATION_PIPE)
@UseFilters(BussinessExceptionFilter)
export class ExternalSubscriberController {
  private readonly logger: Logger = new Logger(ExternalSubscriberController.name);

  constructor(private readonly subscriberService: ISubscriberService) {}

  @ApiOperation({ summary: 'Delete a subscriber' })
  @ApiOkResponse({ type: SubscriberResponse })
  @Delete(':external_id')
  async delete(@Param('external_id') external_id: string): Promise<SubscriberResponse> {
    return new SubscriberResponse(await this.subscriberService.deleteExternal(external_id));
  }

  @ApiOperation({ summary: 'Edit a subscriber' })
  @ApiBody({ type: EditExternalSubscriberDto })
  @ApiOkResponse({ type: SubscriberResponse })
  @Patch()
  async edit(@Body() dto: EditExternalSubscriberDto): Promise<SubscriberResponse> {
    return new SubscriberResponse(await this.subscriberService.editExternal(dto.toInput()));
  }
}
