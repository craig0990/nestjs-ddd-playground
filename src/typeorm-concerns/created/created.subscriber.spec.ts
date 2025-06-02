import { Test } from '@nestjs/testing';
import { ClsService } from 'nestjs-cls';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EMBEDS_CONFIG, EMBEDS_CONFIG_DEFAULT } from '../config.type';
import { mock, MockProxy } from 'jest-mock-extended';
import { CreatedSubscriber } from './created.subscriber';
import { CreatedEmbed } from './created.embed';
import { DataSource, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

describe('CreatedSubscriber', () => {
  let dataSource: DataSource;
  let clsServiceMock: MockProxy<ClsService>;

  @Entity()
  class TestEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column(() => CreatedEmbed)
    created: CreatedEmbed;

    @Column()
    name: string;
  }

  describe('defaults', () => {
    beforeEach(async () => {
      clsServiceMock = mock<ClsService>();

      const module = await Test.createTestingModule({
        imports: [
          TypeOrmModule.forRoot({
            type: 'sqlite',
            database: ':memory:',
            entities: [TestEntity],
            synchronize: true,
          }),
        ],
        providers: [
          {
            provide: EMBEDS_CONFIG,
            useValue: EMBEDS_CONFIG_DEFAULT,
          },
          {
            provide: ClsService,
            useValue: clsServiceMock,
          },
          CreatedSubscriber,
        ],
      }).compile();

      dataSource = module.get(DataSource);

      await dataSource.synchronize();
    });

    afterEach(async () => {
      await dataSource.destroy();
    });

    it('should set created.by when inserting an entity', async () => {
      const testEntity = new TestEntity();
      testEntity.name = 'Test Entity';

      clsServiceMock.get
        .calledWith(EMBEDS_CONFIG_DEFAULT.clsUserKey)
        .mockReturnValue('testUser');

      const repository = dataSource.getRepository(TestEntity);
      await repository.save(testEntity);

      const savedEntity = await repository.findOneOrFail({
        where: { name: 'Test Entity' },
      });
      expect(savedEntity.created.by).toBe('testUser');
    });

    it('should set created.by to defaultUserId when user is not in cls', async () => {
      const testEntity = new TestEntity();
      testEntity.name = 'Test Entity';

      clsServiceMock.get
        .calledWith(EMBEDS_CONFIG_DEFAULT.clsUserKey)
        .mockReturnValue(null);

      const repository = dataSource.getRepository(TestEntity);
      await repository.save(testEntity);

      const savedEntity = await repository.findOneOrFail({
        where: { name: 'Test Entity' },
      });
      expect(savedEntity.created.by).toBe(EMBEDS_CONFIG_DEFAULT.defaultUserId);
    });

    it('should not override existing created.by property', async () => {
      const testEntity = new TestEntity();
      testEntity.name = 'Test Entity';
      testEntity.created = { by: 'existingUser', at: new Date() };

      clsServiceMock.get
        .calledWith(EMBEDS_CONFIG_DEFAULT.clsUserKey)
        .mockReturnValue('testUser');

      const repository = dataSource.getRepository(TestEntity);
      await repository.save(testEntity);

      const savedEntity = await repository.findOneOrFail({
        where: { name: 'Test Entity' },
      });
      expect(savedEntity.created.by).toBe('existingUser');
    });
  });

  describe('custom userIdentifier', () => {
    beforeEach(async () => {
      clsServiceMock = mock<ClsService>();

      const module = await Test.createTestingModule({
        imports: [
          TypeOrmModule.forRoot({
            type: 'sqlite',
            database: ':memory:',
            entities: [TestEntity],
            synchronize: true,
          }),
        ],
        providers: [
          {
            provide: EMBEDS_CONFIG,
            useValue: {
              ...EMBEDS_CONFIG_DEFAULT,
              userIdentifier: (user?: { id: string }) => user?.id,
            },
          },
          {
            provide: ClsService,
            useValue: clsServiceMock,
          },
          CreatedSubscriber,
        ],
      }).compile();

      dataSource = module.get(DataSource);

      await dataSource.synchronize();
    });

    afterEach(async () => {
      await dataSource.destroy();
    });

    it('should use the custom userIdentifier to set updated.by', async () => {
      const testEntity = new TestEntity();
      testEntity.name = 'Test Entity';

      clsServiceMock.get
        .calledWith(EMBEDS_CONFIG_DEFAULT.clsUserKey)
        .mockReturnValue({ id: 'customUser' });

      const repository = dataSource.getRepository(TestEntity);
      await repository.save(testEntity);

      const savedEntity = await repository.findOneOrFail({
        where: { name: 'Test Entity' },
      });
      expect(savedEntity.created.by).toBe('customUser');
    });
  });
});
