import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/infrastructure/configuration/configuration';

describe('UserService', () => {
  beforeEach(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true, load: [configuration] })],
      providers: [],
    }).compile();
  });

  describe('GetAll', () => {
    it('should return found users', async () => {});
  });
});
