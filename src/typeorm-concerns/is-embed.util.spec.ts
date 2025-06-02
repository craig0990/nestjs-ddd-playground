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
        'example',
        ExampleEmbed,
        new EntityWithEmbed(),
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
        'example',
        ExampleEmbed,
        new EntityWithoutEmbed(),
        mock<EntityMetadata>({
          embeddeds: [],
        }),
      ),
    ).toBe(false);
  });

  it('should return false if the entity is null or undefined', () => {
    expect(
      isEmbed(
        'example',
        ExampleEmbed,
        null,
        mock<EntityMetadata>({
          embeddeds: [],
        }),
      ),
    ).toBe(false);

    expect(
      isEmbed(
        'example',
        ExampleEmbed,
        undefined,
        mock<EntityMetadata>({
          embeddeds: [],
        }),
      ),
    ).toBe(false);
  });
});
