import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { TypeOrmConcernsSubscriber } from '../typeorm-concerns.subscriber';
import { isEmbed } from '../is-embed.util';
import { CreatedEmbed } from './created.embed';

@EventSubscriber()
export class CreatedSubscriber
  extends TypeOrmConcernsSubscriber
  implements EntitySubscriberInterface
{
  beforeInsert({ entity, metadata }: InsertEvent<any>) {
    if (isEmbed('created', CreatedEmbed, entity, metadata)) {
      entity.created ??= new CreatedEmbed();
      entity.created.by ??=
        this.config.userIdentifier(this.cls.get(this.config.clsUserKey)) ||
        this.config.defaultUserId;
    }
  }
}
