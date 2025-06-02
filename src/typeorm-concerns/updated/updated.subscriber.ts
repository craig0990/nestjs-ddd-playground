import {
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { TypeOrmConcernsSubscriber } from '../typeorm-concerns.subscriber';
import { isEmbed } from '../is-embed.util';
import { UpdatedEmbed } from './updated.embed';

@EventSubscriber()
export class UpdatedSubscriber
  extends TypeOrmConcernsSubscriber
  implements EntitySubscriberInterface
{
  beforeUpdate({ entity, metadata }: UpdateEvent<any>) {
    if (isEmbed('updated', UpdatedEmbed, entity, metadata)) {
      entity.updated ??= new UpdatedEmbed();
      entity.updated.by ??=
        this.config.userIdentifier(this.cls.get(this.config.clsUserKey)) ||
        this.config.defaultUserId;
    }
  }
}
