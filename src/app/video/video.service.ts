import { EventEmitter, Injectable } from '@angular/core';
import { VgAPI } from 'videogular2/core';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  playerReady: EventEmitter<VgAPI> = new EventEmitter<VgAPI>();

  constructor() {
  }

  onPlayerReady(api: VgAPI) {
    this.playerReady.emit(api);
  }
}
