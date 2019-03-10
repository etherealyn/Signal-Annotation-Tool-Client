import { EventEmitter, Injectable } from '@angular/core';
import { VgAPI } from 'videogular2/core';

interface PlayerReadyEvent {
  api: VgAPI;
  index: number;
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  playerReady = new EventEmitter<PlayerReadyEvent>();

  constructor() {
  }

  onPlayerReady(api: VgAPI, index: number) {
    this.playerReady.emit({api, index});
  }
}
