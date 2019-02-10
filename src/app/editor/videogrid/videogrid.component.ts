import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VgAPI } from 'videogular2/core';
import { IVideo } from '../video/video.interface';
import { throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-videogrid',
  templateUrl: './videogrid.component.html',
  styleUrls: [ './videogrid.component.scss' ]
})
export class VideogridComponent implements OnInit {

  @Input() videos: IVideo[];
  @Output() playerReady = new EventEmitter();

  apis: VgAPI[];
  guard = 0;
  isPlaying = false;
  playbackValues: string[] = [ '0.25', '0.5', '0.75', '1', '1.25', '1.50', '1.75', '2' ];

  lastMouseLeft = 0;

  currentTime = 0;
  max = 100;

  constructor() {
  }

  ngOnInit() {
  }

  onPlay() {
    this.apis.forEach((api: VgAPI) => {
      api.play();
    });
    this.isPlaying = true;
  }

  onPlayerReady(api: VgAPI) {
    if (!this.apis) {
      this.apis = [];
    }

    this.apis.push(api);

    if (this.apis.length === 1) {
      const head = this.apis[0];
      head.subscriptions.timeUpdate.pipe(throttleTime(50)).subscribe(() => {
        this.currentTime = (head.currentTime / head.duration) * 100;
      });
    }

    if (this.apis.length === this.videos.length) {
      this.playerReady.emit(this.apis[0]);
    }
  }

  setTime(value) {
    if (this.guard % 2 === 0) {
      /** This funny logic is due to a bug on Webkit-based browsers, leading to change firing twice */
      this.guard += 1;
      this.apis.forEach((api: VgAPI) => {
        // api.getDefaultMedia().currentTime = value;
        api.seekTime(value, true);
      });
    } else {
      this.guard = 0;
    }
  }

  onMouseEnter(i: number) {
    this.apis[i].volume = 1;
  }

  onMouseLeave(i: number) {
    this.apis[i].volume = 0;
    this.lastMouseLeft = i;
  }

  onPause() {
    this.apis.forEach((api: VgAPI) => {
      api.pause();
    });
    this.isPlaying = false;
  }

  onGlobalMouseLeave() {
    const api: VgAPI = this.apis[this.lastMouseLeft];
    api.volume = 1;
  }

  onPlayPause() {
    if (!this.isPlaying) {
      this.onPlay();
    } else {
      this.onPause();
    }
  }
}
