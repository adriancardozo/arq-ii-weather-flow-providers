import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { BussinessError } from 'src/bussiness/errors/bussiness.error';

@Catch(BussinessError)
export class BussinessExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(BussinessExceptionFilter.name);
  private readonly baseFilter: BaseExceptionFilter;

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {
    this.baseFilter = new BaseExceptionFilter(this.httpAdapterHost.httpAdapter);
  }

  catch(exception: BussinessError, host: ArgumentsHost) {
    try {
      throw new InternalServerErrorException();
    } catch (error) {
      this.logger.error(error);
      this.baseFilter.catch(error, host);
    }
  }
}
