export interface EmbedsModuleOptions {
  /**
   * The key used to retrieve the user identifier from CLS.
   * Applies to features like Audit, SoftDelete (for deletedBy), etc.
   * Defaults to 'user'.
   */
  clsUserKey: string;

  /**
   * An optional function to extract the user identifier from the CLS context.
   * Defaults to returning the value of the clsUserKey.
   * @param userContext The value retrieved from CLS.
   * @returns The string identifier of the user.
   */
  userIdentifier: (userContext: unknown) => string | undefined;

  /**
   * The default user identifier if no user is found or identified.
   * Defaults to 'system'.
   */
  defaultUserId: string;
}

/**
 * Defines a key in the NestJS provider system that we can use to inject
 * the configuration into embed subscribers and other components.
 */
export const EMBEDS_CONFIG = 'EMBEDS_CONFIG';

export const EMBEDS_CONFIG_DEFAULT: EmbedsModuleOptions = {
  clsUserKey: 'user',
  userIdentifier: (userContext: unknown) =>
    typeof userContext === 'string' ? userContext : undefined,
  defaultUserId: 'system',
};
