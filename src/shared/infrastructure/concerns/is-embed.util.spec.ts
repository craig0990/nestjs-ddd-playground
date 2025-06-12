import { EntityMetadata } from 'typeorm';
import { isEmbed } from './is-embed.util';
import { mock } from 'jest-mock-extended';

describe('isEmbed', () => {
  class ExampleEmbed {
    some: string;
  }

  class EntityWithEmbed {
    example: ExampleEmbed;
  }

  class EntityWithoutEmbed {
    another: string;
  }

  it('should return true if the entity has the embed', () => {
    expect(
      isEmbed(
        new EntityWithEmbed(),
        'example',
        ExampleEmbed,
        mock<EntityMetadata>({
          embeddeds: [
            {
              propertyName: 'example',
              type: ExampleEmbed,
            },
          ],
        }),
      ),
    ).toBe(true);
  });

  it('should return false if the entity does not have the embed', () => {
    expect(
      isEmbed(
        new EntityWithoutEmbed(),
        'example',
        ExampleEmbed,
        mock<EntityMetadata>({
          embeddeds: [],
        }),
      ),
    ).toBe(false);
  });

  it('should return false if the entity is null or undefined', () => {
    expect(
      isEmbed(
        null,
        'example',
        ExampleEmbed,
        mock<EntityMetadata>({
          embeddeds: [],
        }),
      ),
    ).toBe(false);

    expect(
      isEmbed(
        undefined,
        'example',
        ExampleEmbed,
        mock<EntityMetadata>({
          embeddeds: [],
        }),
      ),
    ).toBe(false);
  });
});
