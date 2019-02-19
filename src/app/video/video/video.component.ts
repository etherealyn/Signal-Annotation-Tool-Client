import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { VgAPI } from 'videogular2/core';
import { Subscription } from 'rxjs';
import { ProjectsService } from '../../projects/projects.service';
import { IMediaSubscriptions } from 'videogular2/src/core/vg-media/i-playable';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: [ './video.component.scss' ]
})
export class VideoComponent implements OnInit {
  @Input() source: String;
  @Output() playerReady: EventEmitter<any> = new EventEmitter();

  api: VgAPI;
  url: String;

  // currentTime = 0;
  // duration = 0;

  private subscription: Subscription;

  constructor(private projectsService: ProjectsService) {
    this.url = `${projectsService.projectsUrl}/files`;
  }

  ngOnInit() {
  }

  onPlayerReady$(api: VgAPI) {
    this.api = api;
    this.playerReady.emit(api);

    // const subscriptions: IMediaSubscriptions = api.subscriptions;

    // this.subscription = subscriptions.timeUpdate.subscribe(() => {
    //   this.currentTime = this.api.currentTime;
    // });
    //
    // this.subscription = subscriptions.durationChange.subscribe(() => {
    //   this.duration = api.duration;
    // });
  }
}
