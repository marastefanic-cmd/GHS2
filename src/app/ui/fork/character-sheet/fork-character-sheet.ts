import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { gameManager } from 'src/app/game/businesslogic/GameManager';
import { CharacterSheetNameComponent } from 'src/app/ui/figures/character/sheet/sections/name';
import { CharacterSheetPerksComponent } from 'src/app/ui/figures/character/sheet/sections/perks';
import { CharacterSheetSection } from 'src/app/ui/figures/character/sheet/sections/section';
import { ForkDeckChangesComponent } from 'src/app/ui/fork/deck-changes/deck-changes';

/**
 * Fork: reduced character sheet with only what the group tracks in the app: name, level, perks and custom changes.
 */
@Component({
  imports: [NgClass, CharacterSheetNameComponent, CharacterSheetPerksComponent, ForkDeckChangesComponent],
  selector: 'ghs-fork-character-sheet',
  templateUrl: 'fork-character-sheet.html',
  styleUrls: ['../../figures/sheet.scss', './fork-character-sheet.scss']
})
export class ForkCharacterSheetComponent extends CharacterSheetSection {
  levels: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  get className(): string {
    return gameManager.characterManager.characterName(this.character, false, false, false);
  }

  get availablePerks(): number {
    return gameManager.characterManager.availablePerks(this.character);
  }

  get denied(): boolean {
    return this.locked || !gameManager.stateManager.characterPermissions[this.character.name + '|' + this.character.edition];
  }

  setLevel(level: number) {
    if (this.denied || this.character.level === level) {
      return;
    }
    gameManager.entityManager.before(this.character, this.character, 'setLevel', level);
    gameManager.characterManager.setLevel(this.character, level);
    gameManager.stateManager.after();
  }
}
