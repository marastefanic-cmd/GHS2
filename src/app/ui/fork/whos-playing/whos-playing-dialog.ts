import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { gameManager } from 'src/app/game/businesslogic/GameManager';
import { Character } from 'src/app/game/model/Character';
import { TabClickDirective } from 'src/app/ui/helper/tabclick';

/**
 * Fork: quick "who's playing today" selection. Characters not selected are set absent (and hidden by the
 * hideAbsent setting), selected ones are set present. Closes with true when confirmed.
 */
@Component({
  imports: [NgClass, TabClickDirective],
  selector: 'ghs-whos-playing-dialog',
  templateUrl: './whos-playing-dialog.html',
  styleUrls: ['./whos-playing-dialog.scss']
})
export class WhosPlayingDialogComponent {
  private dialogRef = inject(DialogRef);
  data: { confirmLabel?: string } = inject(DIALOG_DATA, { optional: true }) || {};

  characters: Character[] = whosPlayingCharacters();
  playing: Set<Character> = new Set(this.characters.filter((character) => !character.absent));

  name(character: Character): string {
    return gameManager.characterManager.characterName(character, true);
  }

  icon(character: Character): string {
    return gameManager.characterManager.characterIcon(character.name, character.edition);
  }

  levels: number[] = [0, 1, 2, 3, 4, 5, 6, 7];
  /** scenario level picked by hand, undefined = use the recommended level */
  pickedLevel: number | undefined;

  get averageLevel(): number {
    if (this.playing.size === 0) {
      return 0;
    }
    let sum = 0;
    this.playing.forEach((character) => (sum += character.level));
    return sum / this.playing.size;
  }

  get recommendedLevel(): number {
    return Math.min(7, Math.ceil(this.averageLevel / 2));
  }

  get level(): number {
    return this.pickedLevel !== undefined ? this.pickedLevel : this.recommendedLevel;
  }

  toggle(character: Character) {
    if (this.playing.has(character)) {
      this.playing.delete(character);
    } else {
      this.playing.add(character);
    }
  }

  pickLevel(level: number) {
    this.pickedLevel = level === this.recommendedLevel ? undefined : level;
  }

  confirm() {
    if (this.playing.size > 0) {
      const result: WhosPlayingResult = {
        playing: this.characters.filter((character) => this.playing.has(character)),
        level: this.level
      };
      this.dialogRef.close(result);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}

export function whosPlayingCharacters(): Character[] {
  return gameManager.game.figures.filter((figure) => figure instanceof Character);
}

export type WhosPlayingResult = { playing: Character[]; level: number };

/** Applies a selection from the dialog. Must be called between stateManager.before() and after(). */
export function applyWhosPlaying(result: WhosPlayingResult) {
  whosPlayingCharacters().forEach((character) => {
    character.absent = !result.playing.includes(character);
    if (character.absent && character.active) {
      gameManager.roundManager.toggleFigure(character);
    }
  });
  // keep the app's level calculation and express the picked level as an adjustment to it
  gameManager.game.levelCalculation = true;
  gameManager.game.levelAdjustment = 0;
  gameManager.game.levelAdjustment = result.level - gameManager.levelManager.scenarioLevel();
  gameManager.levelManager.calculateScenarioLevel();
}
