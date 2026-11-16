import type { Settings } from 'src/app/game/model/Settings';

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

/**
 * The group's shared settings. These are forced on every start (the settings menu is hidden), so changing a value
 * here changes it for everyone. Anything not listed keeps the upstream default or the device's own value.
 */
export const FORK_SETTINGS: Partial<Settings> = {
  // Gameplay: monster and ally attack modifiers are drawn on the table, the party/campaign sheet is not used
  monsterAttackModifierDeck: false,
  allyAttackModifierDeck: false,
  partySheet: false,
  // Display
  theme: 'default',
  automaticTheme: false,
  fhStyle: true,
  statAnimations: true,
  columns: false,
  // Automation
  activeApplyConditions: false,
  // Character
  hideAbsent: true,
  // Interface
  damageHPToggle: false,
  characterFullView: true,
  hideCharacterHP: true,
  hideCharacterLoot: true,
  hideCharacterXP: true,
  // Hints
  errata: true,
  backupHint: false,
  // Game clock
  gameClock: true,
  automaticGameClock: false
};
