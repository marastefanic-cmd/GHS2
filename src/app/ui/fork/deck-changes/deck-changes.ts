import { Component } from '@angular/core';
import { gameManager } from 'src/app/game/businesslogic/GameManager';
import { AdditionalIdentifier } from 'src/app/game/model/data/Identifier';
import { CharacterSheetSection } from 'src/app/ui/figures/character/sheet/sections/section';

type DeckChange = { label: string; itemId: number; edition: string };

/**
 * Fork: permanent attack modifier deck changes on the character sheet, without managing items.
 * A change is stored as the equipped item that causes it, so the deck building of the base app applies it.
 */
@Component({
  selector: 'ghs-fork-deck-changes',
  templateUrl: 'deck-changes.html',
  styleUrls: ['./deck-changes.scss']
})
export class ForkDeckChangesComponent extends CharacterSheetSection {
  changes: DeckChange[] = [{ label: 'Remove one −1 card (Second Skin)', itemId: 33, edition: 'gh2e' }];

  get nextScenarioHint(): boolean {
    return gameManager.game.round > 0;
  }

  active(change: DeckChange): boolean {
    return this.character.progress.equippedItems.some(
      (identifier) => identifier.name === '' + change.itemId && identifier.edition === change.edition
    );
  }

  changeExtraPerks(delta: number) {
    const value = Math.max(0, this.character.progress.extraPerks + delta);
    if (this.locked || value === this.character.progress.extraPerks) {
      return;
    }
    gameManager.stateManager.before('setExtraPerks', this.characterName, value);
    this.character.progress.extraPerks = value;
    gameManager.stateManager.after();
  }

  toggle(change: DeckChange) {
    if (this.locked) {
      return;
    }
    gameManager.stateManager.before('forkDeckChange', this.characterName);
    if (this.active(change)) {
      this.character.progress.equippedItems = this.character.progress.equippedItems.filter(
        (identifier) => identifier.name !== '' + change.itemId || identifier.edition !== change.edition
      );
    } else {
      this.character.progress.equippedItems.push(new AdditionalIdentifier(change.itemId, change.edition));
    }
    // rebuilding during a scenario would lose drawn cards, blesses and curses, so then it applies from the next scenario
    if (gameManager.game.round === 0) {
      this.character.attackModifierDeck = gameManager.attackModifierManager.buildCharacterAttackModifierDeck(this.character);
      gameManager.attackModifierManager.shuffleModifiers(this.character.attackModifierDeck);
    }
    gameManager.stateManager.after();
  }
}
