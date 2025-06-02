import { Test } from '@nestjs/testing';
import { ClsService } from 'nestjs-cls';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EMBEDS_CONFIG, EMBEDS_CONFIG_DEFAULT } from '../config.type';
import { mock, MockProxy } from 'jest-mock-extended';
import { UpdatedSubscriber } from './updated.subscriber';
import { UpdatedEmbed } from './updated.embed';
import { DataSource, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

describe('UpdatedSubscriber', () => {
  let dataSource: DataSource;
  let clsServiceMock: MockProxy<ClsService>;

  @Entity()
  class TestEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column(() => UpdatedEmbed)
    updated: UpdatedEmbed;

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
          UpdatedSubscriber,
        ],
      }).compile();

      dataSource = module.get(DataSource);

      await dataSource.synchronize();
    });

    afterEach(async () => {
      await dataSource.destroy();
    });

    it('should set updated.by when updating an entity', async () => {
      const testEntity = new TestEntity();
      testEntity.name = 'Test Entity';

      clsServiceMock.get
        .calledWith(EMBEDS_CONFIG_DEFAULT.clsUserKey)
        .mockReturnValue('testUser');

      const repository = dataSource.getRepository(TestEntity);
      await repository.save(testEntity);
      testEntity.name = 'Updated Entity';
      await repository.save(testEntity);

      const savedEntity = await repository.findOneOrFail({
        where: { name: 'Updated Entity' },
      });
      expect(savedEntity.updated.by).toBe('testUser');
    });

    it('should set updated.by to defaultUserId when user is not in cls', async () => {
      const testEntity = new TestEntity();
      testEntity.name = 'Test Entity';

      clsServiceMock.get
        .calledWith(EMBEDS_CONFIG_DEFAULT.clsUserKey)
        .mockReturnValue(null);

      const repository = dataSource.getRepository(TestEntity);
      await repository.save(testEntity);
      testEntity.name = 'Updated Entity';
      await repository.save(testEntity);

      const savedEntity = await repository.findOneOrFail({
        where: { name: 'Updated Entity' },
      });
      expect(savedEntity.updated.by).toBe(EMBEDS_CONFIG_DEFAULT.defaultUserId);
    });

    it('should not override existing updated.by property', async () => {
      const testEntity = new TestEntity();
      testEntity.name = 'Test Entity';
      testEntity.updated = { by: 'existingUser', at: new Date() };

      clsServiceMock.get
        .calledWith(EMBEDS_CONFIG_DEFAULT.clsUserKey)
        .mockReturnValue('testUser');

      const repository = dataSource.getRepository(TestEntity);
      await repository.save(testEntity);
      testEntity.name = 'Updated Entity';
      await repository.save(testEntity);

      const savedEntity = await repository.findOneOrFail({
        where: { name: 'Updated Entity' },
      });
      expect(savedEntity.updated.by).toBe('existingUser');
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
          UpdatedSubscriber,
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
      testEntity.name = 'Updated Entity';
      await repository.save(testEntity);

      const savedEntity = await repository.findOneOrFail({
        where: { name: 'Updated Entity' },
      });
      expect(savedEntity.updated.by).toBe('customUser');
    });
  });
});
