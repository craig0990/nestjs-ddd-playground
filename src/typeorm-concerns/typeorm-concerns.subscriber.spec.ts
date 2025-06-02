import { Test } from '@nestjs/testing';
import { ClsService } from 'nestjs-cls';
import {
  DataSource,
  Entity,
  EntitySubscriberInterface,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EMBEDS_CONFIG } from './config.type';
import { TypeOrmConcernsSubscriber } from './typeorm-concerns.subscriber';
import { Injectable } from '@nestjs/common';
import { mock, MockProxy } from 'jest-mock-extended';

describe('TypeOrmConcernsSubscriber', () => {
  let dataSource: DataSource;
  let subscriber: TestSubscriber;
  let beforeInsertSpy: jest.SpyInstance;
  let clsServiceMock: MockProxy<ClsService>;

  @Entity()
  class TestEntity {
    @PrimaryGeneratedColumn()
    id: number;
    name: string;
  }

  @Injectable()
  class TestSubscriber
    extends TypeOrmConcernsSubscriber
    implements EntitySubscriberInterface
  {
    beforeInsert() {
      // Intentionally empty
    }
  }

  beforeAll(async () => {
    clsServiceMock = mock<ClsService>();

    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [TestEntity],
          synchronize: true,
        } as TypeOrmModuleOptions),
      ],
      providers: [
        {
          provide: EMBEDS_CONFIG,
          useValue: { someConfig: 'test' },
        },
        {
          provide: ClsService,
          useValue: clsServiceMock,
        },
        TestSubscriber,
      ],
    }).compile();

    dataSource = module.get(DataSource);
    subscriber = module.get(TestSubscriber);

    beforeInsertSpy = jest.spyOn(subscriber, 'beforeInsert');

    await dataSource.synchronize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('should call afterInsert when an entity is inserted', async () => {
    const testEntity = new TestEntity();
    testEntity.name = 'Test Entity';

    const repository = dataSource.getRepository(TestEntity);
    await repository.save(testEntity);

    expect(beforeInsertSpy).toHaveBeenCalledTimes(1);
  });
});
