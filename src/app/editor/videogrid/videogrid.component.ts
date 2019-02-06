import { Component, Input, OnInit } from '@angular/core';
import { VgAPI } from 'videogular2/core';
import { IVideo } from '../video/video.interface';

@Component({
  selector: 'app-videogrid',
  templateUrl: './videogrid.component.html',
  styleUrls: [ './videogrid.component.scss' ]
})
export class VideogridComponent implements OnInit {

  @Input() videos: IVideo[];

  head: VgAPI;
  apis: VgAPI[] = [];
  guard = 0;
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
  }

  onPlayerReady(api: VgAPI) {
    api.volume = 0;
    this.apis.push(api);

    if (this.apis.length === 1) {
      this.head = api;
      // this.head.getDefaultMedia().subscriptions.durationChange.subscribe((value => {
      //   console.log('duration change', value);
      // }));
      this.head.subscriptions.timeUpdate.subscribe(() => {
        this.currentTime = (this.head.currentTime / this.head.duration) * 100;
      });

      // const newOptions = Object.assign({}, this.options);
      // newOptions.ceil = this.head.duration;
      // this.options = newOptions;
    }
  }

  setTime(value) {
    if (this.guard % 2 === 0) { /** This funny logic is due to a bug on Webkit-based browsers, leading to change firing twice */
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
  }

  onGlobalMouseLeave() {
    const api: VgAPI = this.apis[this.lastMouseLeft];
    api.volume = 1;
  }
}
