import { ClsService } from 'nestjs-cls';
import { DataSource, EntitySubscriberInterface } from 'typeorm';
import { EMBEDS_CONFIG, EmbedsModuleOptions } from './config.type';
import { Inject } from '@nestjs/common';

export abstract class TypeOrmConcernsSubscriber {
  constructor(
    @Inject(EMBEDS_CONFIG) protected readonly config: EmbedsModuleOptions,
    protected readonly cls: ClsService,
    dataSource: DataSource,
  ) {
    dataSource.subscribers.push(this as EntitySubscriberInterface);
  }
}
