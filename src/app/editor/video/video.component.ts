import { Component, OnInit } from '@angular/core';
import { VgAPI } from 'videogular2/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: [ './video.component.scss' ]
})
export class VideoComponent implements OnInit {
  private api: VgAPI;
  // playbackValues: string[] = [ '0.3', '0.5', '0.7', '1.0', '1.3', '1.7', '2.0', '3.0', '4.0' ];

  constructor() {
  }

  ngOnInit() {
  }

  onPlayerReady(api: VgAPI) {
    this.api = api;
  }
}
