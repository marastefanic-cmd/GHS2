# GHS2 — a group's fork of Gloomhaven Secretariat

This is a personal fork of [Lurkars/gloomhavensecretariat](https://github.com/Lurkars/gloomhavensecretariat)
(remote `upstream`), tailored to one play group.

## The rule for every change

**Only reshuffle the UI and add shortcuts. Never change how the game logic behaves.**

- Hiding, moving, enlarging or simplifying UI is fine.
- Shortcuts that drive existing mechanics are fine (e.g. the "Remove one −1 card" tick box, which equips the item
  that causes it; the scenario level picker, which sets the existing level adjustment).
- Fixing a real upstream bug is fine when the owner asks for it (e.g. GH2e Second Skin not removing a −1).
- If a request seems to need a change to rules, calculations, deck building, scenario setup or any other behaviour:
  stop and ask the owner for clarification first. Assume the request was misunderstood.

## How the group plays

- Gloomhaven 2nd Edition plus Mercenary Packs characters only.
- One-shot scenarios from the built-in list; no campaign, party, retirement, item, gold or XP tracking in the app.
- Per character only name, level and perks matter (so the attack modifier deck and scenario level are right).
- Character attack modifier decks are drawn in the app; monster and ally decks are drawn on the table.
- Five players rotate, so "Who's Playing" decides who is present for a scenario.
- Everyone uses the same settings; the Settings menu is hidden and shared values live in `FORK_SETTINGS`.

## Where fork code lives

- `src/app/fork-config.ts` — supported editions, shared settings, and the `forkLock` switch.
- `src/app/ui/fork/` — fork-only components (Who's Playing dialog, simplified character sheet, custom changes).
- `forkLock` is enabled by an inline script in `src/index.html`. It is off in unit tests so upstream tests run
  unchanged; gate fork behaviour on `forkLock.enabled`.
- Keep edits to upstream files small so `git merge upstream/main` stays easy. Other editions' data stays in
  `data/` but is not built (`scripts/build-data.js`).

## Checks

- `npm install` (not `npm ci`; upstream's lockfile is out of sync), `npm run build`, `npx ng test --watch=false`.
- Prettier sorts imports, so do not rely on import order for side effects.
