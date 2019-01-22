import {Component, Input, OnInit} from '@angular/core';
import { VgAPI } from 'videogular2/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: [ './video.component.scss' ]
})
export class VideoComponent implements OnInit {
  @Input() source: String;

  private api: VgAPI;
  playbackValues: string[] = [ '0.5', '1', '2' ];
  url: String = 'http://localhost:8080/api/projects/files/';

  constructor() {
  }

  ngOnInit() {

  }

  onPlayerReady(api: VgAPI) {
    this.api = api;
  }
}
