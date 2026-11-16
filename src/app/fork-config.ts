/**
 * Fork configuration: this build only supports Gloomhaven 2nd Edition plus the Mercenary Packs characters.
 * Keep in sync with FORK_EDITIONS in scripts/build-data.js.
 */
export const FORK_EDITION: string = 'gh2e';
export const FORK_EDITIONS: string[] = ['gh2e', 'mp'];
export const FORK_EDITION_DATA_URLS: string[] = FORK_EDITIONS.map((edition) => './assets/data/' + edition + '.json');

/**
 * Set by a small inline script in src/index.html, so it is active before any game state is created.
 * While enabled the game edition is fixed to FORK_EDITION.
 * Not set in unit tests, so upstream tests, which switch editions freely, keep working.
 */
export const forkLock = { enabled: (globalThis as { ghsForkLock?: boolean }).ghsForkLock === true };
