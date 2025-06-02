import { EntityMetadata } from 'typeorm';

export const isEmbed = <T>(
  key: string,
  EmbedConstructor: new (...args: any[]) => T,
  entity: any,
  metadata: EntityMetadata,
): entity is { [key: string]: T | undefined } =>
  !!entity &&
  metadata.embeddeds.some(
    (embed) => embed.propertyName === key && embed.type === EmbedConstructor,
  );
