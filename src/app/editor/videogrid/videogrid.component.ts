import {Component, OnInit} from '@angular/core';
import {VgAPI} from 'videogular2/core';

interface IVideo {
  source: string;
}

@Component({
  selector: 'app-videogrid',
  templateUrl: './videogrid.component.html',
  styleUrls: ['./videogrid.component.scss']
})
export class VideogridComponent implements OnInit {

  apis: VgAPI[] = [];
  timeModel: any;
  selectedRam: any;
  guard = 0;
  playbackValues: string[] = ['0.25', '0.5', '0.75', '1', '1.25', '1.50', '1.75', '2'];
  offsetValues: number[] = [0, 0];

  videos: IVideo[] = [
    {source: '191cf9c7446c3a62257ff046777e015b'},
    {source: '191cf9c7446c3a62257ff046777e015b'},
    {source: '191cf9c7446c3a62257ff046777e015b'},
    {source: '191cf9c7446c3a62257ff046777e015b'},
  ];

  lastMouseLeft = 0;

  constructor() {
  }

  ngOnInit() {
  }

  onPlay() {
    // this.apis.forEach((api, index) => {
    //   const offset = this.offsetValues[index];
    //   api.seekTime(offset);
    // });

    this.apis.forEach((api: VgAPI) => {
      api.play();
    });
  }

  onPlayerReady(api: VgAPI) {
    this.apis.push(api);
    api.volume = 0;
  }

  setTime(value) {
    if (this.guard % 2 === 0) {
      this.guard += 1;
      this.apis.forEach((api: VgAPI) => {
        api.getDefaultMedia().currentTime = value;
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
