import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { VALIDATION_PIPE } from 'src/infrastructure/validation/validation.pipe';
import { BussinessExceptionFilter } from './filters/bussiness-error.filter';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ISubscriberService } from 'src/bussiness/ports/input/services/i-subscriber.service';
import { SubscriberResponse } from './responses/subscriber.response';
import { IdDto } from './dtos/id.dto';
import { CreateSubscriberDto } from './dtos/create-subscriber.dto';
import { EditSubscriberDto } from './dtos/edit-subscriber.dto';

@Controller('subscriber')
@UsePipes(VALIDATION_PIPE)
@UseFilters(BussinessExceptionFilter)
export class SubscriberController {
  private readonly logger: Logger = new Logger(SubscriberController.name);

  constructor(private readonly subscriberService: ISubscriberService) {}

  @ApiOperation({ summary: 'Get all subscribers' })
  @ApiOkResponse({ type: SubscriberResponse, isArray: true })
  @Get()
  async getAll(): Promise<Array<SubscriberResponse>> {
    const subscribers = await this.subscriberService.getAll();
    return subscribers.map((subscriber) => new SubscriberResponse(subscriber));
  }

  @ApiOperation({ summary: 'Get a subscriber' })
  @ApiOkResponse({ type: SubscriberResponse })
  @Get(':id')
  async getById(@Param() param: IdDto): Promise<SubscriberResponse> {
    return new SubscriberResponse(await this.subscriberService.getById(param.id));
  }

  @ApiOperation({ summary: 'Create a subscriber' })
  @ApiBody({ type: CreateSubscriberDto })
  @ApiOkResponse({ type: SubscriberResponse })
  @Post()
  async create(@Body() dto: CreateSubscriberDto): Promise<SubscriberResponse> {
    return new SubscriberResponse(await this.subscriberService.create(dto.toInput()));
  }

  @ApiOperation({ summary: 'Delete a subscriber' })
  @ApiOkResponse({ type: SubscriberResponse })
  @Delete(':id')
  async delete(@Param() param: IdDto): Promise<SubscriberResponse> {
    return new SubscriberResponse(await this.subscriberService.delete(param.id));
  }

  @ApiOperation({ summary: 'Edit a subscriber' })
  @ApiBody({ type: EditSubscriberDto })
  @ApiOkResponse({ type: SubscriberResponse })
  @Patch(':id')
  async edit(@Param() param: IdDto, @Body() dto: EditSubscriberDto): Promise<SubscriberResponse> {
    return new SubscriberResponse(await this.subscriberService.edit(param.id, dto.toInput()));
  }

  @ApiOperation({ summary: 'Synchronize subscribers' })
  @Put()
  async synchronizeSubscribers(): Promise<void> {
    this.logger.log('Synchronizing providers.');
    await this.subscriberService.synchronizeSubscribers();
    this.logger.log('Providers synchronization finished.');
  }
}
