import { EntityMetadata } from 'typeorm';

/**
 * 
 * @param entity The TypeORM entity/partial object to check
 * @param key The key to check on the entity/partial obejct
 * @param EmbedConstructor The "Embedded Entity" we are expecting
 * @param metadata The TypeORM entity metadata, which contains `.emebeddeds` information
 * @returns boolean
 */
export const isEmbed = <T>(
  entity: any,
  key: string,
  EmbedConstructor: new (...args: any[]) => T,
  metadata: EntityMetadata,
): entity is { [key: string]: T | undefined } =>
  !!entity &&
  metadata.embeddeds.some(
    (embed) => embed.propertyName === key && embed.type === EmbedConstructor,
  );
