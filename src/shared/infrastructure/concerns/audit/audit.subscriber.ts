import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { AuditEmbed } from './audit.embed';
import { isEmbed } from '../is-embed.util';

const DEFAULT_AUDIT_USER = 'system';

@Injectable()
@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  constructor(
    private readonly cls: ClsService,
    dataSource: DataSource,
  ) {
    dataSource.subscribers.push(this);
  }

  beforeInsert({ entity, metadata }: InsertEvent<any>) {
    if (isEmbed(entity, 'audit', AuditEmbed, metadata)) {
      entity.audit ??= new AuditEmbed();
      entity.audit.createdBy ??= this.cls.get('user') ?? DEFAULT_AUDIT_USER;
    }
  }

  beforeUpdate({ entity, metadata }: UpdateEvent<any>) {
    if (isEmbed(entity, 'audit', AuditEmbed, metadata)) {
      entity.audit ??= new AuditEmbed();
      entity.audit.updatedBy ??= this.cls.get('user') ?? DEFAULT_AUDIT_USER;
    }
  }
}
