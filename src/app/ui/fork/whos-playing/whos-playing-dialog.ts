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

  toggle(character: Character) {
    if (this.playing.has(character)) {
      this.playing.delete(character);
    } else {
      this.playing.add(character);
    }
  }

  confirm() {
    if (this.playing.size > 0) {
      this.dialogRef.close(this.characters.filter((character) => this.playing.has(character)));
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}

export function whosPlayingCharacters(): Character[] {
  return gameManager.game.figures.filter((figure) => figure instanceof Character);
}

/** Applies a selection from the dialog. Must be called between stateManager.before() and after(). */
export function applyWhosPlaying(playing: Character[]) {
  whosPlayingCharacters().forEach((character) => {
    character.absent = !playing.includes(character);
    if (character.absent && character.active) {
      gameManager.roundManager.toggleFigure(character);
    }
  });
}
