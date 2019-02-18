import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VgAPI } from 'videogular2/core';
import { IVideo } from '../video/video.interface';
import { throttleTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IMediaSubscriptions } from 'videogular2/src/core/vg-media/i-playable';

@Component({
  selector: 'app-videogrid',
  templateUrl: './videogrid.component.html',
  styleUrls: [ './videogrid.component.scss' ]
})
export class VideogridComponent implements OnInit {
  constructor() {
  }

  @Input() videos: IVideo[];
  @Output() playerReady = new EventEmitter();

  apis: VgAPI[];
  guard = 0;
  isPlaying = false;

  playbackValues: string[] = [ '0.25', '0.5', '0.75', '1.0', '1.25', '1.50', '1.75', '2.0', '3.0', '4.0', ];

  currentTime = 0;

  private playbackIndex = 3;
  private progressDelayMilli = 50;
  private lastMouseLeft = 0;

  private timeUpdateSubscription: Subscription;

  ngOnInit() {
  }

  onPlay() {
    if (this.apis) {
      this.apis.forEach((api: VgAPI) => {
        api.play();
      });
      this.isPlaying = true;
    } else {
      console.error('There are no videos to play');
    }
  }

  onPlayerReady(api: VgAPI) {
    if (!this.apis) {
      this.apis = [];
    }

    this.apis.push(api);

    if (this.apis.length === 1) {
      const master = this.apis[0];
      master.subscriptions.timeUpdate.pipe(throttleTime(this.progressDelayMilli)).subscribe(() => {
        // this.currentTime = (master.currentTime / master.duration) * 100;
        this.currentTime = master.currentTime;
      });
    }

    if (this.apis.length === this.videos.length) {
      this.playerReady.emit(this.apis[0]);
    }
  }

  seekTime(value) {
    if (this.guard % 2 === 0) {
      /** This funny logic is due to a bug on Webkit-based browsers, leading to change firing twice */
      this.guard += 1;
      this.apis.forEach((api: VgAPI) => {
        api.seekTime(value); // fixme
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

  nextPlaybackSpeed() {
    this.playbackIndex = (this.playbackIndex + 1) % this.playbackValues.length;
    this.apis.forEach((api: VgAPI) => {
      api.playbackRate = (this.playbackValues[ this.playbackIndex ]);
    });
  }

  getPlaybackValue() {
    return this.playbackValues[this.playbackIndex];
  }

  getDuration() {

  }
}
