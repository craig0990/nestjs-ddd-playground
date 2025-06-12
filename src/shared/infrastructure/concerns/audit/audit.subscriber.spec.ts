import { Test } from '@nestjs/testing';
import { ClsService } from 'nestjs-cls';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { mock, MockProxy } from 'jest-mock-extended';
import { AuditSubscriber } from './audit.subscriber';
import { AuditEmbed } from './audit.embed';

describe(AuditSubscriber.constructor.name, () => {
  let dataSource: DataSource;
  let clsServiceMock: MockProxy<ClsService>;

  @Entity()
  class TestEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column(() => AuditEmbed, { prefix: false })
    audit: AuditEmbed;

    @Column()
    name: string;
  }

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
          provide: ClsService,
          useValue: clsServiceMock,
        },
        AuditSubscriber,
      ],
    }).compile();

    dataSource = module.get(DataSource);
    await dataSource.synchronize();
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  it('should set createdBy on insert', async () => {
    const testEntity = new TestEntity();
    testEntity.name = 'Test Entity';

    clsServiceMock.get.calledWith('user').mockReturnValue('testUser');

    const repository = dataSource.getRepository(TestEntity);
    await repository.save(testEntity);

    const savedEntity = await repository.findOneOrFail({
      where: { name: 'Test Entity' },
    });
    expect(savedEntity.audit.createdBy).toBe('testUser');
  });

  it('should set updatedBy on update', async () => {
    const testEntity = new TestEntity();
    testEntity.name = 'Test Entity';

    const repository = dataSource.getRepository(TestEntity);
    await repository.save(testEntity);

    clsServiceMock.get.calledWith('user').mockReturnValue('testUser');

    testEntity.name = 'Updated Entity';
    await repository.save(testEntity);

    const savedEntity = await repository.findOneOrFail({
      where: { name: 'Updated Entity' },
    });
    expect(savedEntity.audit.updatedBy).toBe('testUser');
  });

  it('should use default user if not in cls for create', async () => {
    const testEntity = new TestEntity();
    testEntity.name = 'Test Entity';

    clsServiceMock.get.calledWith('user').mockReturnValue(undefined);

    const repository = dataSource.getRepository(TestEntity);
    await repository.save(testEntity);

    const savedEntity = await repository.findOneOrFail({
      where: { name: 'Test Entity' },
    });
    expect(savedEntity.audit.createdBy).toBe('system');
  });

  it('should use default user if not in cls for update', async () => {
    const testEntity = new TestEntity();
    testEntity.name = 'Test Entity';

    const repository = dataSource.getRepository(TestEntity);
    await repository.save(testEntity);

    clsServiceMock.get.calledWith('user').mockReturnValue(undefined);

    testEntity.name = 'Updated Entity';
    await repository.save(testEntity);

    const savedEntity = await repository.findOneOrFail({
      where: { name: 'Updated Entity' },
    });
    expect(savedEntity.audit.updatedBy).toBe('system');
  });

  it('should not override existing createdBy property', async () => {
    const testEntity = new TestEntity();
    testEntity.name = 'Test Entity';
    testEntity.audit = { createdBy: 'existingUser', createdAt: new Date() };

    clsServiceMock.get.calledWith('user').mockReturnValue('testUser');

    const repository = dataSource.getRepository(TestEntity);
    await repository.save(testEntity);

    const savedEntity = await repository.findOneOrFail({
      where: { name: 'Test Entity' },
    });
    expect(savedEntity.audit.createdBy).toBe('existingUser');
  });

  it('should not override existing updatedBy property', async () => {
    const testEntity = new TestEntity();
    testEntity.name = 'Test Entity';

    const repository = dataSource.getRepository(TestEntity);
    await repository.save(testEntity);

    testEntity.audit = {
      createdBy: 'existingUser',
      createdAt: new Date(),
      updatedBy: 'existingUser',
    };
    clsServiceMock.get.calledWith('user').mockReturnValue('testUser');

    testEntity.name = 'Updated Entity';
    await repository.save(testEntity);

    const savedEntity = await repository.findOneOrFail({
      where: { name: 'Updated Entity' },
    });
    expect(savedEntity.audit.updatedBy).toBe('existingUser');
  });
});
