import { Component, OnInit } from '@angular/core';
import { VgAPI } from 'videogular2/core';

interface IVideo {
  source: string;
  startOffset?: number;
}

@Component({
  selector: 'app-videogrid',
  templateUrl: './videogrid.component.html',
  styleUrls: [ './videogrid.component.scss' ]
})
export class VideogridComponent implements OnInit {

  head: VgAPI;
  apis: VgAPI[] = [];
  guard = 0;
  playbackValues: string[] = [ '0.25', '0.5', '0.75', '1', '1.25', '1.50', '1.75', '2' ];

  videos: IVideo[] = [
    {source: '191cf9c7446c3a62257ff046777e015b'},
    {source: '191cf9c7446c3a62257ff046777e015b'},
    // {source: '191cf9c7446c3a62257ff046777e015b'},
    // {source: '191cf9c7446c3a62257ff046777e015b'},
  ];

  lastMouseLeft = 0;

  currentTime;
  max = 200;

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
      this.head.getDefaultMedia().subscriptions.durationChange.subscribe((value => {
        console.log('duration change', value);
      }))

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
        api.seekTime(value);
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
